import { useTranslation } from "react-i18next";

export function CustomersView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.customers.title")}</h2>
    </section>
  );
}
