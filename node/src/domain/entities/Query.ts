interface Filter {
	field: string
	operator: string
	value: any
}

interface Sort {
	field: string
	order: string
}

export interface QueryOptions {
	sort?: Sort
	filters?: Filter[]
	page?: number
	limit?: number
}
