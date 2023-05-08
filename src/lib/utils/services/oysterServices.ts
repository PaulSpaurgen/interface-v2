import {
	addFundsToOysterJob,
	approveFundsForOysterJobAdd,
	cancelRateReviseOysterJob,
	createNewOysterJob,
	finaliseRateReviseOysterJob,
	initiateRateReviseOysterJob,
	settleOysterJob,
	stopOysterJob,
	withdrawFundsFromOysterJob
} from '$lib/controllers/contractController';
import { oysterStore } from '$lib/data-stores/oysterStore';
import type { OysterInventoryDataModel } from '$lib/types/oysterComponentType';
import type { OysterStore } from '$lib/types/storeTypes';
import type { BigNumber, Bytes } from 'ethers';
import { BigNumberZero } from '../constants/constants';
import { kOysterRateMetaData } from '../constants/oysterConstants';
import { parseMetadata } from '../data-modifiers/oysterModifiers';

const nowTime = Date.now() / 1000;

export async function handleClaimAmountFromOysterJob(jobId: Bytes) {
	try {
		await settleOysterJob(jobId);
		oysterStore.update((value: OysterStore) => {
			return {
				...value,
				merchantJobsData: value.merchantJobsData.map((job) => {
					if (job.id === jobId) {
						console.log('job :>> ', job);
						return {
							...job,
							amountToBeSettled: BigNumberZero
						};
					}
					return job;
				})
			};
		});
	} catch (e) {
		console.log('e :>> ', e);
	}
}

export async function handleApproveFundForOysterJob(amount: BigNumber) {
	try {
		await approveFundsForOysterJobAdd(amount);
		oysterStore.update((value) => {
			return {
				...value,
				allowance: amount
			};
		});
	} catch (e) {
		console.log('e :>> ', e);
	}
}

export async function handleFundsAddToJob(
	jobData: OysterInventoryDataModel,
	amount: BigNumber,
	duration: number
) {
	const { id } = jobData;
	try {
		const txn = await addFundsToOysterJob(id, amount);
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
		// return modifiedJobData;
	} catch (e) {
		console.log('e :>> ', e);
		return jobData;
	}
}

export async function handleFundsWithdrawFromJob(
	jobData: OysterInventoryDataModel,
	amount: BigNumber
) {
	const { id } = jobData;
	try {
		const txn = await withdrawFundsFromOysterJob(id, amount);
		const modifiedJobData = {
			...jobData,
			totalDeposit: jobData.totalDeposit.sub(amount),
			balance: jobData.balance.sub(amount),
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
	} catch (e) {
		console.log('e :>> ', e);
		return jobData;
	}
}

export async function handleInitiateRateRevise(
	jobData: OysterInventoryDataModel,
	newRate: BigNumber
) {
	const { rateReviseWaitingTime } = kOysterRateMetaData;
	const { id } = jobData;
	try {
		await initiateRateReviseOysterJob(id, newRate);
		const modifiedJobData = {
			...jobData,
			reviseRate: {
				newRate: newRate,
				rateStatus: 'pending',
				stopStatus: newRate.gt(BigNumberZero) ? 'disabled' : 'pending',
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
	} catch (e) {
		console.log('e :>> ', e);
	}
}

export async function handleCancelRateRevise(jobData: OysterInventoryDataModel) {
	const { id } = jobData;
	try {
		await cancelRateReviseOysterJob(id);
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
	} catch (e) {
		console.log('e :>> ', e);
	}
}

export async function handleFinaliseRateRevise(
	jobData: OysterInventoryDataModel,
	newRate: BigNumber
) {
	const { id } = jobData;
	try {
		await finaliseRateReviseOysterJob(id);
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
	} catch (e) {
		console.log('e :>> ', e);
	}
}

export async function handleConfirmJobStop(jobData: OysterInventoryDataModel) {
	const { id } = jobData;
	try {
		const tx = await stopOysterJob(id);
		const modifiedJobData = {
			...jobData,
			live: false,
			refund: jobData.balance,
			balance: BigNumberZero,
			status: 'stopped',
			rate: BigNumberZero,
			reviseRate: undefined,
			depositHistory: [
				{
					amount: jobData.balance,
					id: tx.id,
					txHash: tx.hash,
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
	} catch (e) {
		console.log('e :>> ', e);
		return jobData;
	}
}

export async function handleCreateJob(
	owner: string,
	metadata: string,
	provider: string,
	rate: BigNumber,
	balance: BigNumber,
	durationInSec: number
) {
	try {
		const { jobId, txHash } = await createNewOysterJob(metadata, provider, rate, balance);

		const { enclaveUrl, instance, region, vcpu, memory } = parseMetadata(metadata);
		const newJob: OysterInventoryDataModel = {
			id: jobId,
			provider: {
				address: provider,
				name: ''
			},
			owner,
			metadata,
			enclaveUrl,
			instance,
			region,
			vcpu,
			memory,
			amountUsed: BigNumberZero,
			refund: BigNumberZero,
			rate,
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
			amountToBeSettled: BigNumberZero,
			settlementHistory: []
		};
		oysterStore.update((value) => {
			return {
				...value,
				jobsData: [newJob, ...value.jobsData],
				allowance: value.allowance.sub(balance)
			};
		});
		return true;
	} catch (e) {
		console.log('e :>> ', e);
		return false;
	}
}
