import type { TableModel } from '$lib/types/componentTypes';

export const kOysterRateMetaData = {
	currency: 'USDC',
	symbol: '$',
	decimal: 18,
	unit: 'hour',
	unitInSeconds: 3600
};

export const oysterTableItemsPerPage: number = 10;

export const kInstancesTableHeader: TableModel['header'][] = [
	{
		title: 'Instance Type',
		id: 'type'
	},
	{
		title: 'Region',
		id: 'region',
		tooltipText: 'The amount of POND which was placed for conversion to MPond.'
	},
	{
		title: 'Price',
		id: 'price',
		tooltipText:
			'The corresponding amount of MPond received as a result of the conversion from POND. Note: 1 Million POND equals 1 MPond.'
	}
];

// Merchant, Region, Instance, Rate, Amount Paid, Amount Used, Balance, Duration Left, Status
export const kOysterInventoryTableHeader: TableModel['header'][] = [
	{
		title: 'OPERATOR',
		id: 'merchant'
	},
	{
		title: 'INSTANCE',
		id: 'instance'
	},
	{
		title: 'REGION',
		id: 'region'
	},
	{
		title: 'HOURLY RATE',
		id: 'rate',
		sorting: true
	},
	{
		title: 'vCPU',
		id: 'vcpu'
	},
	{
		title: 'MEMORY',
		id: 'memory'
	},
	{
		title: 'BALANCE',
		id: 'balance',
		sorting: true
	},
	{
		title: 'DURATION LEFT',
		id: 'durationLeft'
	},
	{
		title: '',
		id: 'action'
	}
];

export const kInventoryTableColumnsWidth = (id: string) => {
	switch (id) {
		case 'merchant':
			return '15%';
		case 'instance':
			return '10%';
		case 'region':
			return '10%';
		case 'rate':
			return '10%';
		case 'vcpu':
			return '12.5%';
		case 'memory':
			return '12.5%';
		case 'balance':
			return '10%';
		case 'durationLeft':
			return '15%';
		case 'action':
			return '5%';
		default:
			return '5%';
	}
};

export const kOysterPaymentHistoryTableHeader: TableModel['header'][] = [
	{
		title: 'DATE',
		id: 'date'
	},
	{
		title: 'AMOUNT',
		id: 'amount'
	},
	{
		title: 'TX HASH',
		id: 'txHash'
	}
];

export const kOysterHistoryTableHeader: TableModel['header'][] = [
	{
		title: 'Operator',
		id: 'merchant'
	},
	{
		title: 'Instance',
		id: 'instance'
	},
	{
		title: 'Region',
		id: 'region'
	},
	{
		title: 'Amount Paid',
		id: 'totalDeposit',
		sorting: true
	},
	{
		title: 'Amount Used',
		id: 'amountUsed',
		sorting: true
	},
	{
		title: 'Refund',
		id: 'refund',
		sorting: true
	},
	{
		title: 'Duration Run',
		id: 'duration'
	},
	{
		title: 'Status',
		id: 'status'
	},
	{
		title: '',
		id: 'action'
	}
];

export const kHistoryTableColumnsWidth = (id: string) => {
	switch (id) {
		case 'merchant':
			return '15%';
		case 'instance':
			return '10%';
		case 'region':
			return '10%';
		case 'totalDeposit':
			return '12.5%';
		case 'amountUsed':
			return '12.5%';
		case 'refund':
			return '10%';
		case 'duration':
			return '10%';
		case 'status':
			return '10%';
		case 'action':
			return '10%';
		default:
			return '5%';
	}
};

export const kOysterDocLink = 'https://docs.marlin.org/docs/User%20Guides/Oyster/';
export const kOysterSupportLink = 'https://docs.marlin.org/docs/category/tutorials';
