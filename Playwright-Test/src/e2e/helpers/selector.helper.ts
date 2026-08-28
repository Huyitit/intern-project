import { Page, Locator } from '@playwright/test';

export class SelectorHelper {
  constructor(public page: Page) {}

  // Login
  get loginUsernameInput() { return this.page.getByTestId('login-username-input'); }
  get loginPasswordInput() { return this.page.getByTestId('login-password-input'); }
  get loginSubmitButton() { return this.page.getByTestId('login-submit-btn'); }
  get loginRegisterLink() { return this.page.getByTestId('login-register-link'); }
  get loginSuccessToast() { return this.page.getByText('Login successful!'); }

  // Register
  get registerFullNameInput() { return this.page.getByTestId('register-full_name-input'); }
  get registerUsernameInput() { return this.page.getByTestId('register-username-input'); }
  get registerPasswordInput() { return this.page.getByTestId('register-password-input'); }
  get registerPhoneInput() { return this.page.getByTestId('register-phone-input'); }
  get registerEmailInput() { return this.page.getByTestId('register-email-input'); }
  get registerSubmitButton() { return this.page.getByTestId('register-submit-btn'); }
  get registerLoginLink() { return this.page.getByTestId('register-login-link'); }
  get registerRoleSelect() { return this.page.getByTestId('register-role-select'); }
  get registerSuccessToast() { return this.page.getByText('Registration successful! Please login.'); }

  // Dashboard
  get dashboardHeading() { return this.page.getByRole('heading', { level: 2 }); }
  get dashboardWelcomeText() { return this.page.getByTestId('dashboard-welcome-text'); }
  get dashboardContainer() { return this.page.getByTestId('dashboard-page'); }
  get dashboardManageUsersLink() { return this.page.getByRole('link', { name: 'Manage Users' }); }
  get dashboardCreateUserLink() { return this.page.getByRole('link', { name: 'Create User' }); }
  get dashboardProfileLink() { return this.page.getByRole('link', { name: 'Profile' }); }
  get dashboardUploadAvatarLink() { return this.page.getByRole('link', { name: 'Upload Avatar' }); }
  get dashboardLogoutButton() { return this.page.getByRole('button', { name: 'Logout' }); }

  // User Create
  get userCreateContainer() { return this.page.getByTestId('user-create-page'); }
  get userCreateHeading() { return this.page.getByTestId('user-create-heading'); }
  get userCreateForm() { return this.page.getByTestId('user-create-form'); }
  get userCreateFullNameInput() { return this.page.getByTestId('user-create-full_name-input'); }
  get userCreateUsernameInput() { return this.page.getByTestId('user-create-username-input'); }
  get userCreatePasswordInput() { return this.page.getByTestId('user-create-password-input'); }
  get userCreatePhoneInput() { return this.page.getByTestId('user-create-phone-input'); }
  get userCreateEmailInput() { return this.page.getByTestId('user-create-email-input'); }
  get userCreateSubmitButton() { return this.page.getByTestId('user-create-submit-btn'); }

  // Avatar Upload
  get avatarUploadPageContainer() { return this.page.getByTestId('avatar-upload-page'); }
  get avatarUploadHeading() { return this.page.getByTestId('avatar-heading'); }
  get avatarUploadFileInputGroup() { return this.page.getByTestId('avatar-input-group'); }
  get avatarUploadFileInput() { return this.page.getByTestId('avatar-file-input'); }
  get avatarUploadPreviewGroup() { return this.page.getByTestId('avatar-preview-group'); }
  get avatarUploadPreviewImg() { return this.page.getByTestId('avatar-preview-img'); }
  get avatarUploadButton() { return this.page.getByTestId('avatar-upload-btn'); }

  // Profile
  get profileHeading() { return this.page.getByRole('heading', { name: 'My Profile', level: 2 }); }
  get profileCsvSectionHeading() { return this.page.getByRole('heading', { name: 'Update by CSV', level: 3 }); }
  get profileManualSectionHeading() { return this.page.getByRole('heading', { name: 'Manual Update', level: 3 }); }
  get profileCsvFileInput() { return this.page.locator('input[type="file"]'); }
  get profileUploadCsvButton() { return this.page.getByRole('button', { name: /Upload CSV|Uploading\.\.\./i }); }
  get profileFullNameInput() { return this.page.locator('input[name="full_name"]'); }
  get profileUsernameInput() { return this.page.locator('input[name="username"]'); }
  get profilePhoneInput() { return this.page.locator('input[name="phone"]'); }
  get profileEmailInput() { return this.page.locator('input[name="email"]'); }
  get profileUpdateProfileButton() { return this.page.getByRole('button', { name: /Update Profile|Saving\.\.\./i }); }
  get profileLoadingIndicator() { return this.page.getByText('Loading profile...'); }
  get profileErrorState() { return this.page.getByText('Could not load profile'); }

  // Users List
  get userListHeading() { return this.page.getByTestId('user-list-heading'); }
  get userListSearchInput() { return this.page.getByPlaceholder('Search Username...'); }
  get userListSearchButton() { return this.page.getByRole('button', { name: 'Search' }); }
  get userListExportButton() { return this.page.getByRole('button', { name: /Export/i }); }
  get userListPrevButton() { return this.page.getByRole('button', { name: 'Previous' }); }
  get userListNextButton() { return this.page.getByRole('button', { name: 'Next' }); }
  get userListUserTable() { return this.page.getByTestId('user-list-table'); }
  get userListTableBody() { return this.page.getByTestId('user-list-tbody'); }
  get userListLoadingIndicator() { return this.page.getByTestId('user-list-loading'); }
  get userListErrorMessage() { return this.page.getByTestId('user-list-error'); }
  get userListNoUsersFoundRow() { return this.page.getByTestId('user-list-tr-no-users'); }
  get userListSortHeaderId() { return this.page.getByTestId('user-list-th-id'); }
  get userListSortHeaderUsername() { return this.page.getByTestId('user-list-th-username'); }
  get userListFirstUserViewButton() { return this.page.locator('[data-testid^="user-list-view-btn-"]').first(); }
}
