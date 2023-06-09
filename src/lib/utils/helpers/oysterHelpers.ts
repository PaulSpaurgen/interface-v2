import { addToast } from '$lib/data-stores/toastStore';
import type {
	OysterFiltersModel,
	OysterInventoryDataModel,
	OysterMarketplaceDataModel,
	OysterMarketplaceFilterModel
} from '$lib/types/oysterComponentType';
import type { BigNumber } from 'ethers';
import { BigNumberZero } from '../constants/constants';
import { bigNumberToString } from '../conversion';
import { isInputAmountValid } from './commonHelper';

const secondsInHour = 3600;

export const convertRateToPerHourString = (rate: BigNumber, decimal = 18, precision = 2) => {
	const rateInHour = rate.mul(secondsInHour);
	return bigNumberToString(rateInHour, decimal, precision);
};

export const convertHourlyRateToSecondlyRate = (rate: BigNumber) => {
	return rate.div(secondsInHour);
};

export const getSearchedInventoryData = (
	searchInput: string,
	data: OysterInventoryDataModel[] | undefined
) => {
	if (!data) return [];
	if (!searchInput) return data;
	const searchInputLowerCase = searchInput.toLowerCase();
	return data.filter((item) => {
		const {
			instance,
			region,
			provider: { name = '', address }
		} = item;
		return (
			instance.toLowerCase().includes(searchInputLowerCase) ||
			region.toLowerCase().includes(searchInputLowerCase) ||
			name.toLowerCase().includes(searchInputLowerCase) ||
			address.toLowerCase().includes(searchInputLowerCase)
		);
	});
};

export const getSearchedOysterJobsData = (
	searchInput: string,
	data: OysterInventoryDataModel[] | undefined
) => {
	if (!data) return [];
	if (!searchInput) return data;
	const searchInputLowerCase = searchInput.toLowerCase();
	return data.filter((item) => {
		const { instance, region, owner } = item;
		return (
			instance.toLowerCase().includes(searchInputLowerCase) ||
			region.toLowerCase().includes(searchInputLowerCase) ||
			owner.toLowerCase().includes(searchInputLowerCase)
		);
	});
};

export const getSearchedMarketplaceData = (
	searchInput: string,
	data: OysterMarketplaceDataModel[] | undefined
) => {
	if (!data) return [];
	if (!searchInput) return data;
	const searchInputLowerCase = searchInput.toLowerCase();
	return data.filter((item) => {
		const {
			instance,
			region,
			provider: { name = '', address }
		} = item;
		return (
			instance.toLowerCase().includes(searchInputLowerCase) ||
			region.toLowerCase().includes(searchInputLowerCase) ||
			name.toLowerCase().includes(searchInputLowerCase) ||
			address.toLowerCase().includes(searchInputLowerCase)
		);
	});
};

export const getInventoryStatusVariant = (status: string) => {
	switch (status) {
		case 'running':
		case 'active':
		case 'completed':
			return 'success';
		case 'inactive':
		case 'stopped':
			return 'error';
		default:
			return 'primary';
	}
};

export const getInventoryDurationVariant = (duration: number) => {
	if (duration < 86400) {
		return 'error';
	} else if (duration < 86400 * 3) {
		return 'warning';
	} else {
		return 'success';
	}
};

export const sortOysterInventory = (
	data: OysterInventoryDataModel[] | undefined,
	sort: string,
	order: 'asc' | 'desc'
) => {
	if (!data) return [];

	const ascendingSort = (a: OysterInventoryDataModel, b: OysterInventoryDataModel) => {
		if (
			sort === 'balance' ||
			sort === 'rate' ||
			sort === 'totalDeposit' ||
			sort === 'amountUsed' ||
			sort === 'refund'
		) {
			const bnA = a[sort];
			const bnB = b[sort];
			return bnA?.gt(bnB) ? 1 : -1;
		}

		if (
			sort === 'durationLeft' ||
			sort === 'memory' ||
			sort === 'vcpu' ||
			sort === 'durationRun' ||
			sort === 'createdAt' ||
			sort === 'lastSettled' ||
			sort === 'endEpochTime'
		) {
			const nmA = a[sort] ?? 0;
			const nmB = b[sort] ?? 0;
			return nmA > nmB ? 1 : -1;
		}

		if (sort === 'instance' || sort === 'region' || sort === 'status') {
			const stA = a[sort];
			const stB = b[sort];
			return stA > stB ? 1 : -1;
		}

		return 1;
	};
	const sortedData = data.sort((a, b) => {
		if (order === 'asc') {
			return ascendingSort(a, b);
		} else {
			return ascendingSort(b, a);
		}
	});
	return sortedData;
};

export const sortOysterOperatorInventory = (
	data: OysterInventoryDataModel[] | undefined,
	sort: string,
	order: 'asc' | 'desc'
) => {
	if (!data) return [];

	const ascendingSort = (a: OysterInventoryDataModel, b: OysterInventoryDataModel) => {
		if (sort === 'amountToBeSettled') {
			const bnA = a[sort];
			const bnB = b[sort];
			return bnA?.gt(bnB) ? 1 : -1;
		}

		if (sort === 'durationLeft' || sort === 'durationRun' || sort === 'createdAt') {
			const nmA = a[sort] ?? 0;
			const nmB = b[sort] ?? 0;
			return nmA > nmB ? 1 : -1;
		}

		if (sort === 'instance' || sort === 'region' || sort === 'status' || sort === 'provider') {
			const stA = a[sort];
			const stB = b[sort];
			return stA > stB ? 1 : -1;
		}

		return 1;
	};
	const sortedData = data.sort((a, b) => {
		if (order === 'asc') {
			return ascendingSort(a, b);
		} else {
			return ascendingSort(b, a);
		}
	});
	return sortedData;
};

export const sortOysterOperatorHistory = (
	data: OysterInventoryDataModel[] | undefined,
	sort: string,
	order: 'asc' | 'desc'
) => {
	if (!data) return [];

	const ascendingSort = (a: OysterInventoryDataModel, b: OysterInventoryDataModel) => {
		if (sort === 'amountToBeSettled') {
			const bnA = a[sort];
			const bnB = b[sort];
			return bnA?.gt(bnB) ? 1 : -1;
		}

		if (sort === 'durationLeft' || sort === 'durationRun' || sort === 'createdAt') {
			const nmA = a[sort] ?? 0;
			const nmB = b[sort] ?? 0;
			return nmA > nmB ? 1 : -1;
		}

		if (sort === 'instance' || sort === 'region' || sort === 'status' || sort === 'provider') {
			const stA = a[sort];
			const stB = b[sort];
			return stA > stB ? 1 : -1;
		}

		return 1;
	};
	const sortedData = data.sort((a, b) => {
		if (order === 'asc') {
			return ascendingSort(a, b);
		} else {
			return ascendingSort(b, a);
		}
	});
	return sortedData;
};

export const sortOysterMarketplace = (
	data: OysterMarketplaceDataModel[] | undefined,
	sort: string,
	order: 'asc' | 'desc'
) => {
	if (!data) return [];

	const ascendingSort = (a: OysterMarketplaceDataModel, b: OysterMarketplaceDataModel) => {
		if (sort === 'rate') {
			const bnA = a[sort];
			const bnB = b[sort];
			return bnA?.gt(bnB) ? 1 : -1;
		}

		if (sort === 'memory' || sort === 'vcpu') {
			const nmA = a[sort] ?? 0;
			const nmB = b[sort] ?? 0;
			return nmA > nmB ? 1 : -1;
		}

		if (sort === 'instance' || sort === 'region') {
			const stA = a[sort];
			const stB = b[sort];
			return stA > stB ? 1 : -1;
		}

		return 1;
	};
	const sortedData = data.sort((a, b) => {
		if (order === 'asc') {
			return ascendingSort(a, b);
		} else {
			return ascendingSort(b, a);
		}
	});
	return sortedData;
};
export const getSearchAndFilteredMarketplaceData = (
	allMarketplaceData: OysterMarketplaceDataModel[],
	filterMap: Partial<OysterMarketplaceFilterModel>,
	exactMatch = false
) => {
	// for provider, we are checking substring match and need do check on both name and address
	if (filterMap.provider) {
		const value = filterMap.provider.toLowerCase();
		allMarketplaceData = allMarketplaceData.filter((item) => {
			return exactMatch
				? item.provider.address.toLowerCase() === value ||
						item.provider.name?.toLowerCase() === value
				: item.provider.address.toLowerCase().includes(value) ||
						item.provider.name?.toLowerCase()?.includes(value);
		});
	}

	if (filterMap.region) {
		const value = filterMap.region.toLowerCase();
		allMarketplaceData = allMarketplaceData.filter((item) => {
			return exactMatch
				? item.region.toLowerCase() === value || item.regionName.toLowerCase() === value
				: item.region.toLowerCase().includes(value) ||
						item.regionName.toLowerCase().includes(value);
		});
	}

	if (filterMap.memory) {
		const value = filterMap.memory?.toString();
		allMarketplaceData = allMarketplaceData.filter((item) => {
			return exactMatch
				? item.memory?.toString() === value
				: item.memory?.toString()?.includes(value);
		});
	}

	if (filterMap.vcpu) {
		const value = filterMap.vcpu.toString();
		allMarketplaceData = allMarketplaceData.filter((item) => {
			return exactMatch ? item.vcpu?.toString() === value : item.vcpu?.toString()?.includes(value);
		});
	}

	if (filterMap.instance) {
		const value = filterMap.instance?.toLowerCase();
		allMarketplaceData = allMarketplaceData.filter((item) => {
			return exactMatch
				? item.instance?.toLowerCase() === value
				: item.instance.toLowerCase()?.includes(value);
		});
	}

	// if (filterMap.rate) {
	// 	const value = filterMap.rate;
	// 	allMarketplaceData = allMarketplaceData.filter((item) => {
	// 		return value && item.rate?.toString()?.includes(value.toString());
	// 	});
	// }

	return allMarketplaceData;
};

export const getFilteredMarketplaceData = (
	allMarketplaceData: OysterMarketplaceDataModel[],
	filterMap: Partial<OysterMarketplaceFilterModel>
) => {
	// for provider, we are checking substring match and need do check on both name and address
	if (filterMap.provider) {
		const value = filterMap.provider.toLowerCase();
		allMarketplaceData = allMarketplaceData.filter((item) => {
			return item.provider.address.includes(value) || item.provider.name?.includes(value);
		});
	}

	if (filterMap.region) {
		allMarketplaceData = allMarketplaceData.filter((item) => {
			return item.region === filterMap.region;
		});
	}

	if (filterMap.memory) {
		allMarketplaceData = allMarketplaceData.filter((item) => {
			return item.memory === filterMap.memory;
		});
	}

	if (filterMap.vcpu) {
		allMarketplaceData = allMarketplaceData.filter((item) => {
			return item.vcpu === filterMap.vcpu;
		});
	}

	if (filterMap.instance) {
		allMarketplaceData = allMarketplaceData.filter((item) => {
			return item.instance === filterMap.instance;
		});
	}

	if (filterMap.rate) {
		allMarketplaceData = allMarketplaceData.filter((item) => {
			return item.rate === filterMap.rate;
		});
	}

	return allMarketplaceData;
};

export function getAllFiltersListforMarketplaceData(
	filteredData: OysterMarketplaceDataModel[],
	addAllOption = true
) {
	const providers = filteredData.map((item) =>
		item.provider.name && item.provider.name != '' ? item.provider.name : item.provider.address
	);
	// array of arrays where the first element is the region name and the second element is the region code
	const regions = filteredData.map((item) => [item.regionName, item.region]);
	// remove duplicate regions
	const filteredRegions = regions.filter(
		(region, index, self) => index === self.findIndex((t) => t[1] === region[1])
	);
	const instances = filteredData.map((item) => item.instance);
	const vcpus = filteredData
		.map((item) => item.vcpu ?? 0)
		.filter((item) => item !== 0)
		.sort((a, b) => a - b);
	const memories = filteredData
		.map((item) => item.memory ?? 0)
		.filter((item) => item !== 0)
		.sort((a, b) => a - b);
	const rates = filteredData.map((item) => item.rate).sort((a, b) => (a.gt(b) ? 1 : -1));

	return {
		allMarketplaceData: filteredData,
		provider: addAllToList(providers, addAllOption),
		instance: addAllToList(instances, addAllOption),
		region: addAllToList(filteredRegions, addAllOption),
		vcpu: addAllToList(vcpus, addAllOption),
		memory: addAllToList(memories, addAllOption)
		// rate: addAllToList(rates, addAllOption)
	} as OysterFiltersModel;
}

const addAllToList = (data: (string | number | string[])[], addAllOption: boolean) => {
	const setData = [...new Set(data)];
	if (!addAllOption || setData.length === 0) return setData;
	return ['All', ...setData];
};
export function getUpdatedFiltersList(
	previousFilters: OysterFiltersModel,
	currentFilters: OysterFiltersModel,
	filterIdOrders: (keyof OysterFiltersModel)[]
) {
	const newFilter: any = { ...currentFilters };
	for (const id of filterIdOrders) {
		newFilter[id as keyof OysterFiltersModel] = previousFilters[id as keyof OysterFiltersModel];
	}
	return newFilter;
}

export const getRateForProviderAndFilters = (
	providerAddress: string | undefined,
	instance: string | undefined,
	region: string | undefined,
	allMarketplaceData: OysterMarketplaceDataModel[]
) => {
	if (!providerAddress) return undefined;
	if (!instance || !region) return undefined;

	const instanceSelected = allMarketplaceData?.find(
		(_item) =>
			_item.provider.address === providerAddress &&
			_item.instance === instance &&
			_item.region === region
	);
	return instanceSelected?.rate ?? undefined;
};

export const getCreateOrderInstanceRegionFilters = (
	providerAddress: string | undefined,
	allMarketplaceData: OysterMarketplaceDataModel[] | undefined
) => {
	if (!providerAddress || !allMarketplaceData || allMarketplaceData.length === 0) return {};
	const filteredData = allMarketplaceData.filter(
		(_item) => _item.provider.address === providerAddress
	);
	const filters = getAllFiltersListforMarketplaceData(filteredData, false);
	return {
		instance: filters.instance,
		region: filters.region
	};
};

export const computeCost = (duration: number, rate?: BigNumber) => {
	try {
		return rate ? rate.mul(duration) : BigNumberZero;
	} catch (e) {
		addToast({
			variant: 'error',
			message: `Error computing cost, please try again.`
		});
		return BigNumberZero;
	}
};

export const computeDuration = (durationString: string, durationUnitInSec: number) => {
	return isInputAmountValid(durationString)
		? Math.floor(Number(durationString) * durationUnitInSec)
		: 0;
};

export const computeDurationString = (duration: number | undefined, durationUnitInSec: number) => {
	if (!duration || duration === 0 || durationUnitInSec === 0) return '';
	return Math.floor(duration / durationUnitInSec).toString();
};

export const addRegionNameToMarketplaceData = (
	objArray: OysterMarketplaceDataModel[],
	mapping: Record<string, string>
) => {
	const newArray = objArray.map((obj) => {
		const region = obj.region;
		const regionName = mapping[region];
		if (regionName) {
			return { ...obj, regionName };
		} else {
			return obj;
		}
	});
	return newArray;
};
