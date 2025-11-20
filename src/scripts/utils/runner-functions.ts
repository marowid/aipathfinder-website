export async function runModuleDefault(file: string, testEl: string = "default") {
    if (testEl !== "default") {
        if (!document.querySelector(testEl)) return;
    }

    const module = await import(`../modules/${file}.ts`);
    return module.default();
}

export async function runComponentDefault(file: string, testEl: string = "default") {
    if (testEl !== "default") {
        if (!document.querySelector(testEl)) return;
    }

    const module = await import(`../components/${file}.ts`);
    return module.default();
}

export async function runDefault(file: string) {
    const module = await import(`../base/${file}.ts`);
    return module.default();
}

export async function runLayoutDefault(file: string) {
    const module = await import(`../layout/${file}.ts`);
    return module.default();
}
