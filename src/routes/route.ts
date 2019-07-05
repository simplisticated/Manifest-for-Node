import {
	AnyResponse
} from "../response";

export type Route = {
	url: string,
	methods: {
		get?: AnyResponse,
		post?: AnyResponse,
		put?: AnyResponse,
		delete?: AnyResponse
	}
};