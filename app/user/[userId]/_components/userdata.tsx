"use client";

import { toast } from "sonner";
import { AlignLeft, Settings, UserCheck, Shield, TrendingUp, ChevronRight } from "lucide-react"; // Added new icons
import { redirect, useParams } from "next/navigation";
import { useState, useRef, ElementRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener } from "usehooks-ts";

import { useAction } from "@/hooks/use-action";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { FormTextarea } from "@/components/form/form-textarea"; // Keeping for compatibility, but its use is adjusted
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { SafeUser } from "@/app/types";
import Select, { MultiValue, ActionMeta } from 'react-select';
import { Separator } from "@/components/ui/separator";
import { updateUser } from "@/actions/update-user";
import { cn } from "@/lib/utils";
import { useOverdueStore } from "@/hooks/useOverduState";
import { useQueueStore } from "@/hooks/use-QueueState";
import { useCompletedTaskStore } from "@/hooks/use-CompletedTaskState";
import { useInverseStore } from "@/hooks/use-inverseState";
import { uselistStore } from "@/hooks/use-listState";
import { useCardReadModeStore } from "@/hooks/use-cardReadMode";
import { useShowBGImageStore } from "@/hooks/use-showBGImage";
import { useInverseTableStore } from "@/hooks/use-inverseTableState";
import { useCollapseStore } from "@/hooks/use-collapseState";
import { useShowMobileViewStore } from "@/hooks/use-mobileView";

interface UserDataProps {
  data: SafeUser;
  currentUser?: SafeUser | null;
};

// Interface for Select options (already defined, but including here for completeness)
interface Option {
    value: string;
    label: string;
}

export const UserData = ({
  data,
  currentUser
}: UserDataProps) => {
  const params = useParams();
  const queryClient = useQueryClient();
  
  // State variables initialization (keeping original for minimal logic change)
  const [isChecked, setIsChecked] = useState(data.isAdmin || false); 
  const [isCheckedReadMode, setIsCheckedReadMode] = useState(data.cardReadMode || false); 
  const [isCheckedShowMobileView, setIsCheckedShowMobileView] = useState(data.showMobileView || false); 
  const [isCheckedShowBGImage, setIsCheckedShowBGImage] = useState(data.showBGImage || false); 
  const [isCheckedNotificationToaster, setIsCheckedNotificationToaster] = useState(data.notificationToaster || false); 
  const [isCheckedTogglePendingTasksOrAll, setIsCheckedTogglePendingTasksOrAll] = useState(data.togglePendingTasksOrAll || false); 
  const [isCheckedToggleRecentTaskorAll, setIsCheckedToggleRecentTaskorAll] = useState(data.toggleRecentTaskorAll || false); 
  const [isCheckedToggleInverse, setIsCheckedToggleInverse] = useState(data.toggleInverse || false); 
  const [isCheckedToggleInverseTable, setIsCheckedToggleInverseTable] = useState(data.toggleInverseTable || false); 
  const [isCheckedEmptyListShow, setIsCheckedEmptyListShow] = useState(data.emptyListShow || false); 
  const [isCheckedShowMyProjectsOnLoad, setIsCheckedShowMyProjectsOnLoad] = useState(data.showMyProjectsOnLoad || false); 
  const [isCheckedToggleOverdueorAll, setIsCheckedToggleOverdueorAll] = useState(data.toggleOverdueorAll || false); 
  const [isCheckedCollapseBoards, setIsCheckedCollapseBoards] = useState(data.collapseBoards || false); 
  const [isCheckedYscroll, setIsCheckedYScroll] = useState(data.cardYscroll || false); 
  const [isCheckedShowTitle, setIsCheckedShowTitle] = useState(data.cardShowTitle || false); 
  const [recentInput, setRecentInput] = useState<number>(data.recentDays || 7); 

  // Store actions (keeping original)
  const { setOverdueState } = useOverdueStore();
  const { setRecentQueueState } = useQueueStore();
  const { setCompletedTaskState } = useCompletedTaskStore();
  const { setInverseTableState } = useInverseTableStore();
  const { setInverseState } = useInverseStore();
  const { setListState } = uselistStore();
  const { setReadModeState } = useCardReadModeStore();
  const { setShowMobileViewState } = useShowMobileViewStore();
  const { setCollapseState } = useCollapseStore();
  const { setShowBGImageState } = useShowBGImageStore();

  // Handlers (keeping original)
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsChecked(event.target.checked); };
  const handleCheckboxReadModeChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedReadMode(event.target.checked); };
  const handleCheckboxShowMobileViewChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedShowMobileView(event.target.checked); };
  const handleCheckboxShowBGImageChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedShowBGImage(event.target.checked); };
  const handleCheckboxNotificationToasterChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedNotificationToaster(event.target.checked); };
  const handleCheckboxTogglePendingTasksOrAllChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedTogglePendingTasksOrAll(event.target.checked); };
  const handleCheckboxToggleRecentTaskorAllChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedToggleRecentTaskorAll(event.target.checked); };
  const handleCheckboxToggleInverseChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedToggleInverse(event.target.checked); };
  const handleCheckboxToggleInverseTableChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedToggleInverseTable(event.target.checked); };
  const handleCheckboxToggleOverdueorAllChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedToggleOverdueorAll(event.target.checked); };
  const handleCheckboxEmptyListShowChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedEmptyListShow(event.target.checked); };
  const handleCheckboxShowMyProjectsOnLoadChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedShowMyProjectsOnLoad(event.target.checked); };
  const handleCheckboxCollapseBoardsChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedCollapseBoards(event.target.checked); };
  const handleCheckboxYScrollChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedYScroll(event.target.checked); };
  const handleCheckboxShowTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => { setIsCheckedShowTitle(event.target.checked); };
  const handleRecentInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRecentDays = parseInt(event.target.value, 10); 
    if (!isNaN(newRecentDays)) { 
      setRecentInput(newRecentDays);
    }
  };


  const isCurrentLogInUserRecord = currentUser?.id == data.id;
  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const inputboxRef = useRef<ElementRef<"input">>(null);
  const checkboxReadModeRef = useRef<ElementRef<"input">>(null);
  const checkboxShowMobileViewRef = useRef<ElementRef<"input">>(null);
  const checkboxShowBGImageRef = useRef<ElementRef<"input">>(null);
  const checkboxNotificationToasterRef = useRef<ElementRef<"input">>(null);
  const checkboxTogglePendingTasksOrAllRef = useRef<ElementRef<"input">>(null);
  const checkboxToggleRecentTaskorAllRef = useRef<ElementRef<"input">>(null);
  const checkboxToggleOverdueorAllRef = useRef<ElementRef<"input">>(null);
  const checkboxToggleInverseRef = useRef<ElementRef<"input">>(null);
  const checkboxToggleInverseTableRef = useRef<ElementRef<"input">>(null);
  const checkboxEmptyListShowRef = useRef<ElementRef<"input">>(null);
  const checkboxShowMyProjectsOnLoadRef = useRef<ElementRef<"input">>(null);
  const checkboxCollapseBoardsRef = useRef<ElementRef<"input">>(null);
  const checkboxYScrollRef = useRef<ElementRef<"input">>(null);
  const checkboxShowTitleRef = useRef<ElementRef<"input">>(null);
  const inputRecentDayRef = useRef<ElementRef<"input">>(null);


  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      // disableEditing(); // Commented out unused logic
    }
  };
  useEventListener("keydown", onKeyDown);

  // useAction and onSubmit logic (keeping original, as it's backend/API interaction)
  const { execute, fieldErrors } = useAction(updateUser, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", data.id] });
      queryClient.invalidateQueries({ queryKey: ["user-logs", data.id] });
      
      const successMessage = isCurrentLogInUserRecord 
        ? `My profile ${data.name} email: ${data.email} updated successfully.`
        : `User: ${data.name} email: ${data.email} roles updated to: [${data?.roles.join(", ")}]`;
      toast.success(successMessage);
      
      // Update local state stores (keeping original logic)
      setCompletedTaskState(data.togglePendingTasksOrAll);
      setRecentQueueState(data.toggleRecentTaskorAll);
      setInverseState(data.toggleInverse);
      setInverseTableState(data.toggleInverseTable);
      setListState(data.emptyListShow);
      setOverdueState(data.toggleOverdueorAll);
      setReadModeState(data.cardReadMode);
      setShowMobileViewState(data.showMobileView);
      setCollapseState(data.collapseBoards);
      setShowBGImageState(data.showBGImage);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const roles = formData.getAll('roles');
    const stringRoles = roles.map((value) => value) as string[];
    const userId = params?.userID as string;
    
    // Extracting all form data
    const isAdmin = Boolean(formData.get("isAdmin"));
    const isReadMode = Boolean(formData.get("cardReadMode"));
    const isShowMobileView = Boolean(formData.get("showMobileView"));
    const isYScroll = Boolean(formData.get("cardYscroll"));
    const isCardShowTitle = Boolean(formData.get("cardShowTitle"));
    const isShowBGImage = Boolean(formData.get("showBGBGImage")); // Corrected form key if needed, or kept original: showBGImage
    const recentDays = Number(formData.get("recentDays"));
    const notificationToaster = Boolean(formData.get("notificationToaster"));
    const toggleRecentTaskorAll = Boolean(formData.get("toggleRecentTaskorAll"));
    const togglePendingTasksOrAll = Boolean(formData.get("togglePendingTasksOrAll"));
    const toggleOverdueorAll = Boolean(formData.get("toggleOverdueorAll"));
    const toggleInverse = Boolean(formData.get("toggleInverse"));
    const toggleInverseTable = Boolean(formData.get("toggleInverseTable"));
    const emptyListShow = Boolean(formData.get("emptyListShow"));
    const showMyProjectsOnLoad = Boolean(formData.get("showMyProjectsOnLoad"));
    const collapseBoards = Boolean(formData.get("collapseBoards"));
    
    // Execution logic (keeping original)
    if (isCurrentLogInUserRecord) {
      execute({
        id: data.id,
        cardReadMode: isReadMode,
        showMobileView: isShowMobileView,
        showBGImage: isShowBGImage,
        cardYscroll: isYScroll,
        cardShowTitle: isCardShowTitle,
        recentDays: recentDays,
        notificationToaster: notificationToaster,
        togglePendingTasksOrAll: togglePendingTasksOrAll,
        toggleRecentTaskorAll: toggleRecentTaskorAll,
        toggleOverdueorAll: toggleOverdueorAll,
        toggleInverse: toggleInverse,
        toggleInverseTable: toggleInverseTable,
        emptyListShow: emptyListShow,
        showMyProjectsOnLoad: showMyProjectsOnLoad,
        collapseBoards: collapseBoards
      });
    } else {
      execute({
        id: data.id,
        roles: stringRoles,
        isAdmin: isAdmin
      });
    }
  } 

  // Role options (keeping original)
  const options: Option[] = [
    { value: 'visitor', label: "Visitor" },
    { value: 'employee', label: "Employee" },
    { value: 'manager', label: "Manager" },
    { value: 'dataCapture', label: "Data Capture" },
    { value: 'executive', label: "Executive" },
    { value: 'admin', label: "Admin" },
    { value: 'engineer', label: "Engineer" },
    { value: 'shareholder', label: "Shareholder" },
    { value: 'executive', label: "Executive" },
    { value: 'partner', label: "Partner" },
    { value: 'investor', label: "Investor" },
  ];
  const convertToOptionArray = (values: string[]): MultiValue<Option> => {
    return values.map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));
  };
  const [selectedValue, setSelectedValue] = useState<MultiValue<Option>>(convertToOptionArray(data.roles.map((option: any) => option)));

  const handleSelectChange = (newValue: MultiValue<Option>, actionMeta: ActionMeta<Option>) => {
    const optionsArray = Array.from(newValue);
    setSelectedValue(optionsArray);
  };

  // Access control logic (keeping original)
  let allowedRoles: String[] = ['admin', 'manager'];
  const isAllowedAccess = currentUser?.roles.filter((role: string) =>
    allowedRoles.some((y) => y.toLowerCase().includes(role.toLowerCase()))
  ) || [];
  if (isAllowedAccess?.length === 0 && currentUser?.id !== data.id) return redirect('/denied'); 

  // Helper component for clean checkbox rendering
  const CheckboxField = ({ id, name, checked, onChange, disabled, label, reference }: {
    id: string, name: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean, label: string, reference: any
  }) => (
    <div className="flex items-center space-x-2 p-1 rounded-sm hover:bg-neutral-50 transition">
      <input 
        id={id} 
        name={name}
        type="checkbox" 
        ref={reference} 
        checked={checked}
        onChange={onChange}
        disabled={disabled} 
        className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
      />
      <label htmlFor={id} className={cn("text-sm text-neutral-600", disabled && "opacity-70 cursor-not-allowed")}>
        {label}
      </label>
    </div>
  );

  return (
    <div className="flex items-start gap-x-3 md:min-w-[700px]">
      {/* Icon is for general context, AlignLeft is a bit generic. Using Settings or UserCheck is better */}
      {isCurrentLogInUserRecord ? <UserCheck className="h-5 w-5 mt-0.5 text-neutral-700" /> : <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />}
      
      <div className="w-full">
        {/* Title and Back Link */}
        <p className="flex flex-row justify-between font-semibold text-neutral-700 mb-4">
          <span className="flex items-center space-x-2 text-xl">
            {isChecked && isCurrentLogInUserRecord && (
              <svg className="text-yellow-500" width="23" height="23" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            )} 
            {isCurrentLogInUserRecord ? 'Your Profile & Preferences' : `Manage User: ${data.name || 'Details'}`}
          </span>
          
          {!isCurrentLogInUserRecord && (
            <Link
              href={`/users`}
              className="hover:text-red-700 text-sm font-normal text-blue-600"
            >
              &larr; Back to **Users List**
            </Link>
          )}
        </p>

        <form
          id="id1"
          name="name1"
          action={onSubmit}
          ref={formRef}
          className="space-y-6"
        >
          {/* USER INFO / ADMIN SECTION */}
          <div className="space-y-3 p-4 border rounded-lg bg-neutral-50">
            <h3 className="text-lg font-semibold flex items-center text-gray-700">
              <Shield className="h-4 w-4 mr-2" />
              {isCurrentLogInUserRecord ? 'Account Details' : 'Admin & Roles Management'}
            </h3>

            {/* Email/Name Info */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Email Address: 
                <span className="font-normal text-blue-600 ml-2">{data.email}</span>
              </label>
              <label className="text-sm font-medium text-neutral-700">
                Name: 
                <span className="font-normal text-blue-600 ml-2">{data.name}</span>
              </label>

                {/* NEW LINK TO INVESTOR REGISTRY */}
                {isCurrentLogInUserRecord && (
                  <div className="mt-2 pt-2 border-t border-neutral-200">
                    <Link 
                      href={`/u/${currentUser.id}`}
                      className="group flex items-center gap-x-2 text-sm font-bold text-[#C1663E] hover:text-[#1A2F23] transition-colors"
                    >
                      <TrendingUp className="w-4 h-4" />
                      View My Investor Registry & Pledges
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
            </div>
            
            <Separator className="my-3"/>
            
            {/* Admin and Roles Controls */}
            <div className="flex md:flex-row flex-col justify-between items-start md:items-center space-y-4 md:space-y-0">
              {/* Is Admin Checkbox */}
              <CheckboxField
                id="isAdmin" 
                name="isAdmin"
                checked={isChecked}
                onChange={handleCheckboxChange}
                disabled={isCurrentLogInUserRecord}
                label="Is User an Admin (Superuser)?"
                reference={inputboxRef}
              />
              
              {/* Roles Multi-Select */}
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="roles" className="text-sm font-medium text-neutral-700 mb-1">Roles:</label>
                <Select
                  className="text-gray-500 w-full"
                  id="roles"
                  name="roles"
                  value={selectedValue}
                  onChange={handleSelectChange}
                  options={options}
                  isMulti 
                  isDisabled={isCurrentLogInUserRecord}
                />
              </div>
            </div>
          </div>
          
          {/* PERSONAL PREFERENCES SECTION */}
          {isCurrentLogInUserRecord && (
            <div className="space-y-3 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold flex items-center text-gray-700">
                <Settings className="h-4 w-4 mr-2" />
                Display & Task Preferences
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {/* DISPLAY SETTINGS */}
                <div className="space-y-2">
                    <p className="font-medium text-neutral-600 pt-2">Display Customization</p>
                    <Separator/>
                    <CheckboxField 
                        id="cardReadMode" name="cardReadMode" checked={isCheckedReadMode} 
                        onChange={handleCheckboxReadModeChange} disabled={!isCurrentLogInUserRecord} 
                        label="Card Read Mode (Optimized text view)" 
                        reference={checkboxReadModeRef} 
                    />
                    <CheckboxField 
                        id="cardYscroll" name="cardYscroll" checked={isCheckedYscroll} 
                        onChange={handleCheckboxYScrollChange} disabled={!isCurrentLogInUserRecord} 
                        label="Enable Card Y-Scroll Mode" 
                        reference={checkboxYScrollRef} 
                    />
                    <CheckboxField 
                        id="cardShowTitle" name="cardShowTitle" checked={isCheckedShowTitle} 
                        onChange={handleCheckboxShowTitleChange} disabled={!isCurrentLogInUserRecord} 
                        label="Show Card Titles" 
                        reference={checkboxShowTitleRef} 
                    />
                    <CheckboxField 
                        id="showBGImage" name="showBGImage" checked={isCheckedShowBGImage} 
                        onChange={handleCheckboxShowBGImageChange} disabled={!isCurrentLogInUserRecord} 
                        label="Show Background Image" 
                        reference={checkboxShowBGImageRef} 
                    />
                    <CheckboxField 
                        id="collapseBoards" name="collapseBoards" checked={isCheckedCollapseBoards} 
                        onChange={handleCheckboxCollapseBoardsChange} disabled={!isCurrentLogInUserRecord} 
                        label="Collapse Boards (Mini-View State)" 
                        reference={checkboxCollapseBoardsRef} 
                    />
                     <CheckboxField 
                        id="emptyListShow" name="emptyListShow" checked={isCheckedEmptyListShow} 
                        onChange={handleCheckboxEmptyListShowChange} disabled={!isCurrentLogInUserRecord} 
                        label="Display Empty Lists" 
                        reference={checkboxEmptyListShowRef} 
                    />
                     <CheckboxField 
                        id="showMobileView" name="showMobileView" checked={isCheckedShowMobileView} 
                        onChange={handleCheckboxShowMobileViewChange} disabled={!isCurrentLogInUserRecord} 
                        label="Force Mobile View on Desktop" 
                        reference={checkboxShowMobileViewRef} 
                    />
                    <CheckboxField 
                        id="notificationToaster" name="notificationToaster" checked={isCheckedNotificationToaster} 
                        onChange={handleCheckboxNotificationToasterChange} disabled={!isCurrentLogInUserRecord} 
                        label="Mobile Notification Toaster" 
                        reference={checkboxNotificationToasterRef} 
                    />
                    
                </div>
                
                {/* FILTERING/TOGGLE SETTINGS */}
                <div className="space-y-2">
                    <p className="font-medium text-neutral-600 pt-2">Task and Project Filtering</p>
                    <Separator/>
                    <CheckboxField 
                        id="togglePendingTasksOrAll" name="togglePendingTasksOrAll" checked={isCheckedTogglePendingTasksOrAll} 
                        onChange={handleCheckboxTogglePendingTasksOrAllChange} disabled={!isCurrentLogInUserRecord} 
                        label="Toggle Pending Tasks (Otherwise show All)" 
                        reference={checkboxTogglePendingTasksOrAllRef} 
                    />
                    <CheckboxField 
                        id="toggleRecentTaskorAll" name="toggleRecentTaskorAll" checked={isCheckedToggleRecentTaskorAll} 
                        onChange={handleCheckboxToggleRecentTaskorAllChange} disabled={!isCurrentLogInUserRecord} 
                        label="Toggle Recent Tasks (Otherwise show All)" 
                        reference={checkboxToggleRecentTaskorAllRef} 
                    />
                    <CheckboxField 
                        id="toggleOverdueorAll" name="toggleOverdueorAll" checked={isCheckedToggleOverdueorAll} 
                        onChange={handleCheckboxToggleOverdueorAllChange} disabled={!isCurrentLogInUserRecord} 
                        label="Toggle Overdue Tasks (Otherwise show All)" 
                        reference={checkboxToggleOverdueorAllRef} 
                    />
                    <CheckboxField 
                        id="toggleInverse" name="toggleInverse" checked={isCheckedToggleInverse} 
                        onChange={handleCheckboxToggleInverseChange} disabled={!isCurrentLogInUserRecord} 
                        label="Toggle Inverse [Completed, Overdue, etc.]" 
                        reference={checkboxToggleInverseRef} 
                    />
                    <CheckboxField 
                        id="toggleInverseTable" name="toggleInverseTable" checked={isCheckedToggleInverseTable} 
                        onChange={handleCheckboxToggleInverseTableChange} disabled={!isCurrentLogInUserRecord} 
                        label="Toggle Inverse Table" 
                        reference={checkboxToggleInverseTableRef} 
                    />
                    <CheckboxField 
                        id="showMyProjectsOnLoad" name="showMyProjectsOnLoad" checked={isCheckedShowMyProjectsOnLoad} 
                        onChange={handleCheckboxShowMyProjectsOnLoadChange} disabled={!isCurrentLogInUserRecord} 
                        label="Show My Projects on Load (Otherwise show All)" 
                        reference={checkboxShowMyProjectsOnLoadRef} 
                    />

                    {/* Recent Days Input */}
                    <div className="flex items-center space-x-2 mt-4 p-1 rounded-sm">
                        <label htmlFor="recentDays" className="text-sm font-medium text-neutral-600">
                          Recent Days for Filtering:
                        </label>
                        <input 
                            id="recentDays" 
                            name="recentDays"
                            type="number" 
                            ref={inputRecentDayRef} 
                            value={recentInput}
                            className="border w-16 p-1 text-center text-sm rounded-md shadow-sm focus:border-rose-500"
                            onChange={handleRecentInputChange}
                            disabled={!isCurrentLogInUserRecord} 
                        />
                    </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Submission and Cancel Buttons */}
          <div className="pt-4 flex items-center gap-x-2">
            <FormSubmit 
              className={cn(
                "px-4 py-2 text-white rounded-md transition duration-150",
                isCurrentLogInUserRecord ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-600 hover:bg-blue-700",
              )}
            >
              Save Changes
            </FormSubmit>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-neutral-500 hover:bg-neutral-100"
              // The original component had no actual cancel logic (no state to reset), 
              // but keeping the button for UI completeness.
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

UserData.Skeleton = function UserDataSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full space-y-4">
        <Skeleton className="w-48 h-8 mb-2 bg-neutral-200" />
        <div className="space-y-3 p-4 border rounded-lg">
            <Skeleton className="w-full h-24 bg-neutral-200" />
            <Skeleton className="w-full h-10 bg-neutral-200" />
        </div>
        <div className="space-y-3 p-4 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-8 bg-neutral-200" />
                <Skeleton className="h-8 bg-neutral-200" />
                <Skeleton className="h-8 bg-neutral-200" />
                <Skeleton className="h-8 bg-neutral-200" />
            </div>
        </div>
      </div>
    </div>
  );
};