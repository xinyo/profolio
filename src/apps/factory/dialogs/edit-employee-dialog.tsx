import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { FactoryAvatarPicker } from "@/apps/factory/components/avatar-picker";
import { factoryAvatarOptions, useFactoryStore } from "@/apps/factory/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EditEmployeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId?: string | null;
};

const ACCOUNT_TYPES = ["Admin", "Manager", "Operator"] as const;

const EMPTY_FORM = {
  name: "",
  email: "",
  accountType: "Operator" as (typeof ACCOUNT_TYPES)[number],
  image: factoryAvatarOptions[0]?.src ?? "",
};

export function EditEmployeeDialog({
  open,
  onOpenChange,
  employeeId,
}: EditEmployeeDialogProps) {
  const { t } = useTranslation();
  const employees = useFactoryStore((s) => s.employees);
  const addEmployee = useFactoryStore((s) => s.addEmployee);
  const updateEmployee = useFactoryStore((s) => s.updateEmployee);

  const [name, setName] = useState(EMPTY_FORM.name);
  const [email, setEmail] = useState(EMPTY_FORM.email);
  const [accountType, setAccountType] = useState(EMPTY_FORM.accountType);
  const [image, setImage] = useState(EMPTY_FORM.image);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const suppressUnsavedRef = useRef(false);

  const existingEmployee = employees.find((emp) => emp.id === employeeId);
  const isEdit = employeeId != null;

  useEffect(() => {
    if (!open) return;
    if (existingEmployee) {
      setName(existingEmployee.name);
      setEmail(existingEmployee.email);
      setAccountType(
        ACCOUNT_TYPES.includes(
          existingEmployee.accountType as (typeof ACCOUNT_TYPES)[number],
        )
          ? (existingEmployee.accountType as (typeof ACCOUNT_TYPES)[number])
          : "Operator",
      );
      setImage(existingEmployee.image);
      return;
    }

    setName(EMPTY_FORM.name);
    setEmail(EMPTY_FORM.email);
    setAccountType(EMPTY_FORM.accountType);
    setImage(EMPTY_FORM.image);
  }, [open, existingEmployee]);

  function hasChanges(): boolean {
    if (!isEdit) {
      return (
        name !== EMPTY_FORM.name ||
        email !== EMPTY_FORM.email ||
        accountType !== EMPTY_FORM.accountType ||
        image !== EMPTY_FORM.image
      );
    }

    if (!existingEmployee) return false;

    return (
      name !== existingEmployee.name ||
      email !== existingEmployee.email ||
      accountType !== existingEmployee.accountType ||
      image !== existingEmployee.image
    );
  }

  function handleSubmit() {
    if (!name.trim()) return;

    const data = {
      name: name.trim(),
      email: email.trim(),
      accountType,
      image,
    };

    if (isEdit && employeeId) {
      updateEmployee(employeeId, data);
    } else {
      addEmployee({
        id: `emp-${Date.now()}`,
        ...data,
      });
    }

    suppressUnsavedRef.current = true;
    onOpenChange(false);
  }

  function handleOpenChange(open: boolean) {
    if (!open && hasChanges()) {
      if (!suppressUnsavedRef.current) {
        setShowUnsavedDialog(true);
        return;
      }
      suppressUnsavedRef.current = false;
      return;
    }
    suppressUnsavedRef.current = false;
    onOpenChange(open);
  }

  function handleUnsavedDiscard() {
    setShowUnsavedDialog(false);
    onOpenChange(false);
  }

  function handleUnsavedCancel() {
    setShowUnsavedDialog(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? t("factory.views.team.editEmployee")
                : t("factory.views.team.addEmployee")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee-name">
                {t("factory.views.team.name")}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="employee-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="employee-email">
                {t("factory.views.team.email")}
              </Label>
              <Input
                id="employee-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="employee-account-type">
                {t("factory.views.team.accountType")}
              </Label>
              <Select
                value={accountType}
                onValueChange={(value) =>
                  setAccountType(value as (typeof ACCOUNT_TYPES)[number])
                }
              >
                <SelectTrigger id="employee-account-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Avatar</Label>
              <FactoryAvatarPicker
                value={image}
                onChange={setImage}
                ariaLabel="Select avatar"
                ariaLabelPrefix="Avatar"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              {t("factory.views.customers.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim()}>
              {isEdit
                ? t("factory.views.customers.save")
                : t("factory.views.customers.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("factory.views.customers.unsavedTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("factory.views.customers.unsavedDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleUnsavedCancel}>
              {t("factory.views.customers.keepEditing")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUnsavedDiscard}>
              {t("factory.views.customers.discard")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
