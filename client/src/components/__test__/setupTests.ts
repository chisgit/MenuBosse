import { expect, it, describe, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// expect, it, describe, afterEach are now globally available
// vi is also available for mocking

afterEach(() => {
