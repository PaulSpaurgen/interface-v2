import type {
	OysterInventoryDataModel,
	OysterMarketplaceDataModel,
	ProviderData
} from '$lib/types/oysterComponentType';
import type { Address, OysterStore } from '$lib/types/storeTypes';
import { BIG_NUMBER_ZERO } from '$lib/utils/constants/constants';
import {
	OYSTER_RATE_METADATA,
	OYSTER_RATE_SCALING_FACTOR
} from '$lib/utils/constants/oysterConstants';
import { DEFAULT_OYSTER_STORE } from '$lib/utils/constants/storeDefaults';
import { parseMetadata } from '$lib/utils/data-modifiers/oysterModifiers';
import type { BigNumber, Bytes } from 'ethers';
import { writable, type Writable } from 'svelte/store';

export const oysterStore: Writable<OysterStore> = writable(DEFAULT_OYSTER_STORE);

// we keep the marketplace data untouched as it does not depend on the wallet address and is loaded
// regardless of whether the user is connected or not.
// NOTE: if the user switches network, the marketplace data is overwritten
/**
 * Resets the oysterStore to its default value. (read file comments)
 */
export function resetOysterStore() {
	oysterStore.update((state) => {
		return {
			...DEFAULT_OYSTER_STORE,
			providerData: {
				registered: false,
				data: undefined
			},
			allMarketplaceData: state.allMarketplaceData,
			jobsData: [],
			allowance: BIG_NUMBER_ZERO,
			merchantJobsData: [],
			marketplaceLoaded: true
		};
	});
}

export function initializeProviderDataInOysterStore(providerDetails: ProviderData) {
	oysterStore.update((value) => {
		return {
			...value,
			providerData: {
				data: providerDetails,
				registered: true
			},
			providerDetailsLoaded: true
		};
	});
}

export function updateProviderInOysterStore(cpUrl: string, walletAddress: Address) {
	oysterStore.update((value) => {
		value.providerData.registered = true;
		if (value.providerData.data) {
			value.providerData.data.cp = cpUrl;
			value.providerData.data.id = walletAddress;
			value.providerData.data.live = true;
		}
		return value;
	});
}

export function removeProviderFromOysterStore() {
	oysterStore.update((value) => {
		value.providerData.registered = false;
		if (value.providerData.data) {
			value.providerData.data.cp = '';
			value.providerData.data.id = '';
			value.providerData.data.live = false;
		}
		return value;
	});
}

export function updateJobStatusByIdInOysterStore(updatedStatus: any) {
	oysterStore.update((state) => {
		const jobData = state.jobsData;
		const jobWithMatchingJobId = jobData.find((job) => updatedStatus.jobId === job.id);

		if (jobWithMatchingJobId) {
			jobWithMatchingJobId.ip = updatedStatus.ip;
		}
		return {
			...state,
			jobsData: jobData
		};
	});
}

export function updateAmountToBeSettledForJobInOysterStore(jobId: Bytes, updatedAmount: BigNumber) {
	oysterStore.update((value: OysterStore) => {
		return {
			...value,
			merchantJobsData: value.merchantJobsData.map((job) => {
				if (job.id === jobId) {
					return {
						...job,
						amountToBeSettled: updatedAmount
					};
				}
				return job;
			})
		};
	});
}

export function updateMerchantJobsInOysterStore(merchantJobs: OysterInventoryDataModel[] | []) {
	oysterStore.update((value) => {
		return {
			...value,
			merchantJobsData: merchantJobs,
			merchantJobsLoaded: true
		};
	});
}

export function updateApprovedFundsInOysterStore(updatedAmount: BigNumber) {
	oysterStore.update((value) => {
		return {
			...value,
			allowance: value.allowance.lt(updatedAmount) ? updatedAmount : value.allowance
		};
	});
}

export function addFundsToJobInOysterStore(
	id: Bytes,
	txn: any,
	jobData: OysterInventoryDataModel,
	amount: BigNumber,
	duration: number
) {
	const nowTime = Date.now() / 1000;
	const modifiedJobData = {
		...jobData,
		totalDeposit: jobData.totalDeposit.add(amount),
		balance: jobData.balance.add(amount),
		durationLeft: jobData.durationLeft + duration,
		endEpochTime: jobData.endEpochTime + duration,
		depositHistory: [
			{
				amount,
				id: txn.id,
				txHash: txn.hash,
				timestamp: nowTime,
				isWithdrawal: false,
				transactionStatus: 'deposit'
			},
			...jobData.depositHistory
		]
	};
	oysterStore.update((value: OysterStore) => {
		return {
			...value,
			allowance: value.allowance.sub(amount),
			jobsData: value.jobsData.map((job) => {
				if (job.id === id) {
					return modifiedJobData;
				}
				return job;
			})
		};
	});
}

export function withdrawFundsFromJobInOysterStore(
	id: Bytes,
	txn: any,
	jobData: OysterInventoryDataModel,
	amount: BigNumber,
	duration: number
) {
	const nowTime = Date.now() / 1000;
	const modifiedJobData = {
		...jobData,
		totalDeposit: jobData.totalDeposit.sub(amount),
		balance: jobData.balance.sub(amount),
		durationLeft: jobData.durationLeft - duration,
		endEpochTime: jobData.endEpochTime - duration,
		depositHistory: [
			{
				amount,
				id: txn.id,
				txHash: txn.hash,
				timestamp: nowTime,
				isWithdrawal: true,
				transactionStatus: 'withdrawal'
			},
			...jobData.depositHistory
		]
	};
	oysterStore.update((value: OysterStore) => {
		return {
			...value,
			jobsData: value.jobsData.map((job) => {
				if (job.id === id) {
					return modifiedJobData;
				}
				return job;
			})
		};
	});
}

export function initiateRateReviseInOysterStore(
	id: Bytes,
	jobData: OysterInventoryDataModel,
	newRate: BigNumber
) {
	const { rateReviseWaitingTime } = OYSTER_RATE_METADATA;
	const nowTime = Date.now() / 1000;
	const modifiedJobData = {
		...jobData,
		reviseRate: {
			newRate: newRate,
			rateStatus: 'pending',
			stopStatus: newRate.gt(BIG_NUMBER_ZERO) ? 'disabled' : 'pending',
			updatesAt: nowTime + rateReviseWaitingTime
		}
	};
	oysterStore.update((value: OysterStore) => {
		return {
			...value,
			jobsData: value.jobsData.map((job) => {
				if (job.id === id) {
					return modifiedJobData;
				}
				return job;
			})
		};
	});
}

export function cancelRateReviseInOysterStore(id: Bytes, jobData: OysterInventoryDataModel) {
	const modifiedJobData = {
		...jobData,
		reviseRate: undefined
	};
	oysterStore.update((value: OysterStore) => {
		return {
			...value,
			jobsData: value.jobsData.map((job) => {
				if (job.id === id) {
					return modifiedJobData;
				}
				return job;
			})
		};
	});
}

export function updateJobStatusOnTimerEndInOysterStore(jobData: OysterInventoryDataModel) {
	const { id } = jobData;
	const nowTime = Date.now() / 1000;
	const modifiedJobData = {
		...jobData,
		reviseRate: {
			newRate: BIG_NUMBER_ZERO,
			rateStatus: 'pending',
			stopStatus: 'completed',
			updatesAt: nowTime
		}
	};
	oysterStore.update((value: OysterStore) => {
		return {
			...value,
			jobsData: value.jobsData.map((job) => {
				if (job.id === id) {
					return modifiedJobData;
				}
				return job;
			})
		};
	});
}

export function updateJobRateInOysterStore(id: Bytes, newRate: BigNumber) {
	oysterStore.update((value) => {
		return {
			...value,
			jobsData: value.jobsData.map((job) => {
				if (job.id === id) {
					return {
						...job,
						rate: newRate,
						reviseRate: undefined
					};
				}
				return job;
			})
		};
	});
}

export function stopJobInOysterStore(id: Bytes, txn: any, jobData: OysterInventoryDataModel) {
	const nowTime = Date.now() / 1000;
	const modifiedJobData = {
		...jobData,
		live: false,
		refund: jobData.balance,
		balance: BIG_NUMBER_ZERO,
		status: 'stopped',
		rate: BIG_NUMBER_ZERO,
		reviseRate: undefined,
		endEpochTime: nowTime,
		depositHistory: [
			{
				amount: jobData.balance,
				id: txn.id,
				txHash: txn.hash,
				timestamp: nowTime,
				isWithdrawal: true,
				transactionStatus: 'stopped'
			},
			...jobData.depositHistory
		]
	};
	oysterStore.update((value) => {
		return {
			...value,
			jobsData: value.jobsData.map((job) => {
				if (job.id === id) {
					return modifiedJobData;
				}
				return job;
			})
		};
	});
}

export function createNewJobInOysterStore(
	txn: any,
	approveReciept: any,
	owner: string,
	metadata: string,
	provider: { name?: string; address: string },
	rate: BigNumber,
	balance: BigNumber,
	durationInSec: number
) {
	const txHash = txn.hash;
	const jobOpenEvent = approveReciept.events?.find((event: any) => event.event === 'JobOpened');
	const jobId = jobOpenEvent?.args?.job;

	const nowTime = Date.now() / 1000;

	const { enclaveUrl, instance, region, vcpu, memory } = parseMetadata(metadata);
	const newJob: OysterInventoryDataModel = {
		id: jobId,
		provider: {
			name: provider?.name || '',
			address: provider.address
		},
		owner,
		metadata,
		enclaveUrl,
		instance,
		region,
		vcpu,
		memory,
		amountUsed: BIG_NUMBER_ZERO,
		refund: BIG_NUMBER_ZERO,
		rate,
		downScaledRate: rate.div(OYSTER_RATE_SCALING_FACTOR),
		balance,
		totalDeposit: balance,
		live: true,
		lastSettled: nowTime,
		createdAt: nowTime,
		endEpochTime: nowTime + durationInSec,
		durationLeft: durationInSec,
		durationRun: 0,
		status: 'running',
		depositHistory: [
			{
				amount: balance,
				id: txHash,
				txHash: txHash,
				timestamp: nowTime,
				isWithdrawal: false,
				transactionStatus: 'deposit'
			}
		],
		amountToBeSettled: BIG_NUMBER_ZERO,
		settlementHistory: []
	};
	oysterStore.update((value) => {
		return {
			...value,
			jobsData: [newJob, ...value.jobsData],
			allowance: value.allowance.sub(balance)
		};
	});
}

export function updateMarketplaceDataInOysterStore(marketPlaceData: OysterMarketplaceDataModel[]) {
	oysterStore.update((store) => {
		return {
			...store,
			allMarketplaceData: marketPlaceData,
			marketplaceLoaded: true
		};
	});
}

export function initializeOysterStore(
	providerDetail: any,
	allowance: BigNumber,
	oysterJobs: OysterInventoryDataModel[]
) {
	oysterStore.update((value) => {
		return {
			...value,
			providerData: {
				data: providerDetail,
				registered: providerDetail !== null
			},
			allowance: allowance,
			jobsData: oysterJobs,
			oysterStoreLoaded: true
		};
	});
}
