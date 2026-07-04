import { useTranslation } from "react-i18next";

export function ProductionView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.production.title")}</h2>
    </section>
  );
}
