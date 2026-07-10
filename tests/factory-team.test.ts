import { afterEach, describe, expect, it } from "vitest";

import {
  factoryEmployees,
  factoryEmployeesById,
  factoryUser,
  filterTeamMembers,
  useFactoryStore,
  type FactoryEmployee,
} from "@/apps/factory/store";

function resetEmployees() {
  useFactoryStore.setState({
    employees: [...factoryEmployees],
    employeesById: { ...factoryEmployeesById },
    user: { ...factoryUser },
  });
}

describe("factory team (employees)", () => {
  afterEach(() => {
    resetEmployees();
  });

  it("initializes mock employees and employeesById index", () => {
    const state = useFactoryStore.getState();

    expect(state.employees).toHaveLength(10);
    expect(state.employees[0]).toMatchObject({
      id: "emp-1",
      name: "Alex Rivera",
      accountType: "Admin",
    });

    expect(Object.keys(state.employeesById)).toHaveLength(10);
    expect(state.employeesById["emp-1"]).toMatchObject({ name: "Alex Rivera" });
    expect(state.employeesById["emp-10"]).toMatchObject({
      name: "Avery Santos",
    });
  });

  it("initializes the user separately", () => {
    const state = useFactoryStore.getState();

    expect(state.user).toMatchObject({
      id: "user-1",
      name: "Avery Morgan",
      accountType: "Admin",
      email: "avery@factory.example",
    });
  });

  it("filterTeamMembers filters by name, email, and accountType", () => {
    const state = useFactoryStore.getState();

    // filter by name
    expect(filterTeamMembers(state.employees, "Alex").map((e) => e.id)).toEqual(
      ["emp-1"],
    );

    // filter by email domain
    expect(
      filterTeamMembers(state.employees, "jordan").map((e) => e.id),
    ).toEqual(["emp-2"]);

    // filter by accountType
    expect(
      filterTeamMembers(state.employees, "Manager").map((e) => e.id),
    ).toEqual(["emp-2", "emp-4", "emp-8"]);

    // empty query returns all
    expect(filterTeamMembers(state.employees, "")).toHaveLength(10);

    // no match
    expect(filterTeamMembers(state.employees, "zzzznotfound")).toHaveLength(0);
  });

  it("addEmployee adds to employees array and employeesById index", () => {
    const newEmployee: FactoryEmployee = {
      id: "emp-test-1",
      name: "Test Employee",
      email: "test@factory.example",
      accountType: "Operator",
      image: "/src/assets/avatar/agent_avatar_24.svg",
    };

    useFactoryStore.getState().addEmployee(newEmployee);

    const state = useFactoryStore.getState();

    expect(state.employees).toHaveLength(11);
    expect(state.employees.at(-1)).toMatchObject(newEmployee);
    expect(state.employeesById["emp-test-1"]).toMatchObject(newEmployee);
  });

  it("updateEmployee updates the target and keeps the index in sync", () => {
    useFactoryStore.getState().updateEmployee("emp-3", {
      name: "Samira Osei-Kuffour",
      accountType: "Manager",
    });

    const state = useFactoryStore.getState();
    const updated = state.employees.find((e) => e.id === "emp-3");
    const untouched = state.employees.find((e) => e.id === "emp-4");

    expect(updated).toMatchObject({
      name: "Samira Osei-Kuffour",
      accountType: "Manager",
      email: "samira.osei@factory.example",
    });
    expect(untouched?.name).toBe("Taylor Wright");

    // index should reflect the update
    expect(state.employeesById["emp-3"]).toMatchObject({
      name: "Samira Osei-Kuffour",
      accountType: "Manager",
    });
    expect(state.employeesById["emp-3"]).toBe(updated);
  });

  it("archiveEmployee removes from employees array and employeesById index", () => {
    useFactoryStore.getState().archiveEmployee("emp-5");

    const state = useFactoryStore.getState();

    expect(state.employees).toHaveLength(9);
    expect(state.employees.find((e) => e.id === "emp-5")).toBeUndefined();
    expect(state.employeesById["emp-5"]).toBeUndefined();

    // other employees are unaffected
    expect(state.employeesById["emp-4"]).toBeDefined();
    expect(state.employeesById["emp-6"]).toBeDefined();
  });
});
