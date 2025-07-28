import instance from "../../utils/axiosConfig";
import { ConsentForm } from "../../models/types";

export const getConsentFormsByStudentId = async (
  studentId: string
): Promise<ConsentForm[]> => {
  const res = await instance.get(
    `/api/ConsentForm/get-consent-forms-by-student-id/${studentId}`
  );
  return res.data;
};

// Thêm hàm mới để lấy học sinh theo parentId
export const getStudentsByParentId = async (
  parentId: string
): Promise<any[]> => {
  const res = await instance.get(
    `/api/Student/get-student-by-parent-id/${parentId}`
  );
  return res.data;
};

// Thêm hàm mới để lấy consent form của phụ huynh (tất cả con)
export const getConsentFormsByParentId = async (
  parentId: string
): Promise<ConsentForm[]> => {
  try {
    // Lấy danh sách học sinh của phụ huynh
    const students = await getStudentsByParentId(parentId);

    if (!students || students.length === 0) {
      return [];
    }

    // Lấy consent form cho tất cả học sinh
    const consentFormPromises = students.map((student) =>
      getConsentFormsByStudentId(student.id)
    );

    const consentFormArrays = await Promise.all(consentFormPromises);

    // Flatten mảng kết quả
    const allConsentForms = consentFormArrays.flat();

    return allConsentForms;
  } catch (error) {
    console.error("Error fetching consent forms by parent ID:", error);
    return [];
  }
};
export async function deleteConsentForm(consentFormId: string) {
  const response = await fetch(
    `/api/ConsentForm/delete-consent-form/${consentFormId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete consent form");
  }
}
// Sửa đổi hàm này để lấy tất cả consent form của campaign, không cần scheduleId
export const getConsentFormsByCampaign = async (
  campaignId: string
): Promise<ConsentForm[]> => {
  const res = await instance.get(
    `/api/ConsentForm/get-consent-forms-by-campaign-id/${campaignId}`
  );
  return res.data;
};

export const getAllConsentForms = async (): Promise<ConsentForm[]> => {
  const res = await instance.get(`/api/ConsentForm/get-all-consent-forms`);
  return res.data;
};

export async function updateConsentForm(
  consentFormId: string,
  payload: {
    campaignId: string;
    studentId: string;
    isApproved: boolean;
    consentDate: string;
    reasonForDecline: string;
    updatedBy?: string;
  }
) {
  await instance.put(
    `/api/ConsentForm/update-consent-form/${consentFormId}`,
    payload
  );
}
