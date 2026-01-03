import { motion } from "framer-motion";
import {
  BellAlertIcon,
  ExclamationCircleIcon,
  ClockIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { getThemeColors, getThemeShadows } from "../utils/theme";
import React, { useState } from "react"
import { dismissFollowUp, updateFollowUp } from "../api/index";



const FollowUpNotif = ({ applications, isDark, onDismiss, onEdit }) => {
  const colors = getThemeColors(isDark);
  const shadows = getThemeShadows(isDark);

  const [dismissedIds, setDismissedIds] = useState([]);
  const today = new Date();
  const upcoming = [];
  const overdue = [];

  applications.forEach((app) => {
    if (app.status?.toLowerCase() !== "follow up") return;

    const dateToCheck = new Date(app.followUpDate || app.applicationDate);
    const diffTime = dateToCheck.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      overdue.push(app);
    } else if (diffDays >= 1 && diffDays <= 3) {
      upcoming.push(app);
    }
  });

  const visibleUpcoming = upcoming.filter(app => !dismissedIds.includes(app._id));
  const visibleOverdue = overdue.filter(app => !dismissedIds.includes(app._id));

  const nothingToShow = visibleUpcoming.length === 0 && visibleOverdue.length === 0;

  return (
    <div
      className="rounded-2xl border p-4 transition-all duration-300"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        boxShadow: shadows.sm,
        height: "250px",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin"
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <BellAlertIcon className="h-7 w-7 text-orange-500" />
          <h3
            className="text-lg font-semibold transition-colors"
            style={{ color: colors.foreground }}
          >
            Track Follow-ups
          </h3>
        </div>

        <div className="flex gap-2">
          {visibleUpcoming.length > 0 && (
            <span
              className="text-sm px-3 py-1 rounded-xl font-semibold"
              style={{ backgroundColor: "#f59e0b", color: "white" }}
            >
              Prepare: {visibleUpcoming.length}
            </span>
          )}
          {visibleOverdue.length > 0 && (
            <span
              className="text-sm px-3 py-1 rounded-xl font-semibold"
              style={{ backgroundColor: "#10b981", color: "white" }}
            >
              Update: {visibleOverdue.length}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {nothingToShow ? (
        <div
          className="text-center py-8 transition-colors"
          style={{ color: colors.mutedForeground }}
        >
          <CheckCircleIcon className="h-15 w-15 text-green-500 mx-auto mb-2" />
          <p className="text-xl">No follow-ups needed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...visibleOverdue, ...visibleUpcoming]
            .filter(app => !dismissedIds.includes(app._id))
            .map((app, index) => {
            const followUpDate = new Date(app.followUpDate || app.applicationDate);
            const diffTime = followUpDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isOverdue = diffDays < 0;

            const icon = isOverdue ? (
              <ExclamationCircleIcon className="h-8 w-8 text-green-600" />
            ) : (
              <ClockIcon className="h-8 w-8 text-orange-500" />
            );

            const message = isOverdue
              ? "Follow-up update"
              : `Prepare in ${diffDays} day${diffDays === 1 ? "" : "s"}`;

            return (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, delay: index * 0.05 }}
                className="flex rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.01]"
                style={{
                  backgroundColor: colors.muted,
                  boxShadow: shadows.sm
                }}
              >
                {/* Left colored strip */}
                <div
                  className="w-2"
                  style={{
                    backgroundColor: isOverdue ? "#10b981" : "#f59e0b"
                  }}
                />

                {/* Icon and Content */}
                <div className="flex items-center p-3 gap-4 w-full">
                  {/* Icon */}
                  <div>{icon}</div>

                  {/* Text */}
                  <div className="flex-1">
                    <h4
                      className="font-semibold text-base"
                      style={{ color: colors.foreground }}
                    >
                      {app.company}
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: colors.mutedForeground }}
                    >
                      {app.position} — {message}
                    </p>
                    <div
                      className="text-xs"
                      style={{ color: colors.mutedForeground }}
                    >
                      Follow-up Date:{" "}
                      {followUpDate.toLocaleDateString("en-GB")}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 items-end sm:items-center">
                    <button
                      onClick={async () => {
                        try {
                          await dismissFollowUp(app._id);
                            setDismissedIds(prev => [...prev, app._id]);
                        } catch (error) {
                          console.error("Dismiss failed", error);
                        }
                      }}
                      className="px-3 py-1 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: colors.input,
                        color: colors.mutedForeground,
                        border: `1px solid ${colors.border}`
                      }}
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await updateFollowUp(app._id, {
                            followUpDate: app.followUpDate,
                            status: app.status
                          });
                          onEdit({
                            ...app,
                            applicationDate: app.applicationDate
                              ? new Date(app.applicationDate).toISOString()
                              : "",
                            ...(app.followUpDate && {
                              followUpDate: new Date(app.followUpDate).toISOString()
                            })
                          });
                        } catch (error) {
                          console.error("Update follow-up failed", error);
                        }
                      }}
                      className="px-3 py-1 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.primaryForeground
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FollowUpNotif;
