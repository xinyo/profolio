import { useTranslation } from "react-i18next";

export function TimesheetsView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.timesheets.title")}</h2>
    </section>
  );
}
