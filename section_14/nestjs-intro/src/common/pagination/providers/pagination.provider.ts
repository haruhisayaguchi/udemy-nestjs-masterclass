import { Injectable, Inject } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { type Request } from 'express';
import { URL } from 'url';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
	constructor(
		@Inject(REQUEST)
		private readonly request: Request,
	) {
	}

	public async paginateQuery<T extends ObjectLiteral>(
		paginationQuery: PaginationQueryDto,
		repository: Repository<T>,
	) {
		let results = await repository.find({
			skip: paginationQuery.page && paginationQuery.limit ? (paginationQuery.page - 1) * paginationQuery.limit : 0,
			take: paginationQuery.limit,
		});
		const baseUrl = this.request.protocol + '://' + this.request.headers.host + '/';
		const newUrl = new URL(this.request.url, baseUrl);

		const response: Paginated<T> = {
			data: results,
		}
		if (paginationQuery.page && paginationQuery.limit) {
			const totalItems = await repository.count();
			const totalPages = Math.ceil(totalItems / paginationQuery.limit);
			const nextPage = paginationQuery.page === totalPages ? paginationQuery.page : paginationQuery.page + 1;
			const prevPage = paginationQuery.page === 1 ? paginationQuery.page : paginationQuery.page - 1;
			response.meta = {
				itemsPerPage: paginationQuery.limit,
				totalItems,
				currentPage: paginationQuery.page,
				totalPages,
			}
			response.links = {
				first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=1`,
				last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
				current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
				next: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
				previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${prevPage}`,
			}
		}

		return response;
	}
}
