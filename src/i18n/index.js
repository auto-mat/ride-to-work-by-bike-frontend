export const loadLocaleMessages = () => {
  const locales = import.meta.glob('./[A-Za-z0-9-_,s]+.toml', { eager: true });
  let messages = {};
  Object.keys(locales).forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      // Dynamic import TOML translation file content
      locales[key]().then((content) => {
        messages[locale] = content.default;
      });
    }
  });
  return messages;
};
