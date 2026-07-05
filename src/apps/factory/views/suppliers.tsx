import { useTranslation } from "react-i18next";

export function SuppliersView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.suppliers.title")}</h2>
    </section>
  );
}
