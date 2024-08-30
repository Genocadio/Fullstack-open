function getArgs(): [number, number[]] | [number, number] {
    const args = process.argv.slice(2).map(arg => {
        const num = parseFloat(arg);
        if (isNaN(num)) {
            throw new Error(`Invalid argument: ${arg} is not a number.`);
        }
        return num;
    });

    if (args.length < 2 || args.length > 10) {
        throw new Error('Invalid number of arguments. Must be between 2 and 10.');
    }

    if (args.length === 2) {
        return [args[0], args[1]];
    } else {
        const [first, ...rest] = args;
        return [first, rest];
    }
}

export { getArgs };
