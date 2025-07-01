export const interpolateError = (error: string, ...args: string[]) => {
    for (let i = 0; i < args.length; i++) {
        error = error.replace(`{${i}}`, args[i]);
    }
    
    return error;
}