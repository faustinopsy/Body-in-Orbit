export const itemText = (app, item, field) => (item[`${field}Key`] ? app.t(item[`${field}Key`]) : item[field] ?? '');

export const imageSource = (item) => (item.url ? `${import.meta.env.BASE_URL}${item.url}` : item.image ?? '');