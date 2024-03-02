import "@testing-library/jest-dom";

import "whatwg-fetch";
import fetchMock from "fetch-mock-jest";

import { TextEncoder, TextDecoder } from "text-encoding";

if (typeof window !== "undefined") {
	window.TextEncoder = TextEncoder;
	window.TextDecoder = TextDecoder;
}

class IntersectionObserverMock {
	constructor(
		public callback: IntersectionObserverCallback,
		public options?: IntersectionObserverInit
	) {}

	observe(target: Element): void {
		// Mock implementation or trigger callback based on test requirements
	}

	unobserve(target: Element): void {
		// Mock implementation
	}

	disconnect(): void {
		// Mock implementation
	}
}

Object.defineProperty(window, "IntersectionObserver", {
	writable: true,
	configurable: true,
	value: IntersectionObserverMock,
});

Object.defineProperty(global, "IntersectionObserver", {
	writable: true,
	configurable: true,
	value: IntersectionObserverMock,
});
