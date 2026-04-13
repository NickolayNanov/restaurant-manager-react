export type EmployeeDraft = {
    name: string;
    email: string;
    phoneNumber: string;
    position: string;
    employmentType: EmploymentType;
    status: EmploymentStatus;
    salary: string; // keep as string in input
    currency: 'EUR';
    createdAt: string;
};

export type EmploymentStatus = "Active" | "OnLeave" | "Paused" | "Inactive";
export type EmploymentType = "FullTime" | "PartTime" | "Contract";

export type Employee = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;

    position: string; // Manager, Chef, Waiter...
    employmentType: EmploymentType;

    status: EmploymentStatus;

    salary: number;
    currency: 'EUR';

    createdAt?: string; // ISO date string
    updatedAt: string; // "2 days ago" for UI
};

export type EmployeesSectionProps = {
    restaurantId: string;
}

export type EmployeeBase = {
    name: string;
    email: string;
    position: string;
    employmentType: EmploymentType;
    salary: number;
    phoneNumber: string;
}

export type GetEmployeeByIdResponse = EmployeeBase & {
    id: string;
    restaurantId: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string | null;
    updatedBy: string;
}

export type ListEmployeesByRestaurantResponse = {
    employees : GetEmployeeByIdResponse[]
}

export type CreateEmployeeRequest = EmployeeBase & {
    restaurantId: string|null;
};

export type UpdateEmployeeRequest = EmployeeBase & {
    id: string|null;
};