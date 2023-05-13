export function mapReplacer(key, value) {
  const originalObject = this[key];
  if (originalObject instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(originalObject.entries()) // or with spread: value: [...originalObject]
    };
  } else {
    return value;
  }
}
