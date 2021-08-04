type SortDirection = 'ASC' | 'DESC';

export const validSortDirections: SortDirection[] = ['ASC', 'DESC'];

// Example: sort=name;createdAt,DESC
export const parseSort = (sort: string, validFieldNames: string[]): Record<string, SortDirection> => {
  return sort.split(';').map(sort => sort.split(',')).reduce((orderBy, sortArray) => {
    const [fieldName, sortDirection] = sortArray;

    if (!validFieldNames.includes(fieldName)) {
      return orderBy;
    }

    return Object.assign(orderBy, {
      [fieldName]: validSortDirections.includes(sortDirection as SortDirection) ? sortDirection : 'ASC',
    })
  }, {});
}
