import { useTranslation } from "react-i18next";

export function PlannersView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.planners.title")}</h2>
    </section>
  );
}
