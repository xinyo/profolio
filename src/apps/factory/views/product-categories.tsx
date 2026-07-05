import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductDialog } from "@/apps/factory/dialogs/product-dialog";
import { CategoryDialog } from "@/apps/factory/dialogs/category-dialog";
import { ProductKitDialog } from "@/apps/factory/dialogs/product-kit-dialog";

export function ProductCategoriesView() {
  const { t } = useTranslation();
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [productKitDialogOpen, setProductKitDialogOpen] = useState(false);

  return (
    <section className="factory-view">
      <div className="factory-view-header">
        <div className="factory-view-header-start">
          <h2>{t("factory.views.productCategories.title")}</h2>
          <p className="factory-view-subtitle">
            {t("factory.views.productCategories.subtitle")}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="size-4" />
              {t("factory.views.productCategories.addNew")}
              <ChevronDown className="size-4 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setProductDialogOpen(true)}>
              {t("factory.views.productCategories.addProduct")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryDialogOpen(true)}>
              {t("factory.views.productCategories.addCategory")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProductKitDialogOpen(true)}>
              {t("factory.views.productCategories.addProductKit")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="factory-view-toolbar">
        <div className="factory-view-toolbar-start">
          <div className="factory-search-input-wrapper">
            <Search className="factory-search-input-icon" />
            <Input
              className="factory-search-input"
              placeholder={t(
                "factory.views.productCategories.searchPlaceholder",
              )}
              aria-label={t(
                "factory.views.productCategories.searchPlaceholder",
              )}
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={t("factory.views.productCategories.filterByLabel")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("factory.views.productCategories.allLabels")}
              </SelectItem>
              <SelectItem value="label-a">Label A</SelectItem>
              <SelectItem value="label-b">Label B</SelectItem>
              <SelectItem value="label-c">Label C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
      />
      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
      />
      <ProductKitDialog
        open={productKitDialogOpen}
        onOpenChange={setProductKitDialogOpen}
      />
    </section>
  );
}
