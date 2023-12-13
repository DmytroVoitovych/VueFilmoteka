export const getParamObj = (
  params: URL
): { page?: string; lang?: string } | undefined => {
  if (!!params?.search) {
    const b = [];
    for (const a of params.searchParams) {
      b.push(a);
    }
    console.log(params);
    console.log(Object.fromEntries(b));
    return Object.fromEntries(b);
  }
};
