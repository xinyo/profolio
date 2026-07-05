import { useTranslation } from "react-i18next";

export function ProductCategoriesView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.productCategories.title")}</h2>
    </section>
  );
}
