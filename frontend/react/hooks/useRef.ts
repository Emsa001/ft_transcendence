import React from 'react';

export function useRefHook<T>(initialValue: T | null) {
    return React.useState({ current: initialValue })[0];
};