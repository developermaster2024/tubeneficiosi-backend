export default <T>(value: string, defaultValue: T|null = null) => {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return defaultValue;
}
