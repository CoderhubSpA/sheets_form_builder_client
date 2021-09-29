import { createNamespacedHelpers } from 'vuex';

const generateModuleName = (store, name, suffix = 0) => {
    const nameWithSuffix = `${name}${suffix}`;
    const moduleExists = typeof store.state[nameWithSuffix] !== 'undefined';

    if (!moduleExists) {
        return nameWithSuffix;
    }

    const nextSuffix = ++suffix;
    return generateModuleName(store, name, nextSuffix);
};

export default (store, module, name) => {
    const moduleName = generateModuleName(store, name);
    store.registerModule(moduleName, module);

    return {
        namespace: moduleName,
        namespacedHelpers: createNamespacedHelpers(moduleName),
    };
};
