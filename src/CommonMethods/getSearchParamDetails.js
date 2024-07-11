export const getSearchParamDetail = (searchParams, setSearchParams, addingObject) => {
    const params = Object.fromEntries(searchParams);
    setSearchParams({ ...params, ...addingObject });
};
