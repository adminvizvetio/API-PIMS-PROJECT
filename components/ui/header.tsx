"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Settings from "./header-settings";
import {
  VIZVET_APP_VERSION
} from "@/utils/constants";
export default function Header() {
  return (
    <header className="top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-screen-2xl">
        <div className="relative flex h-14 items-center justify-between gap-3 py-8 px-8 border-b bg-blue-500 text-white shadow-md">
          <div className="flex items-end gap-2"><span className="text-2xl font-bold">VizVet</span> <span>{VIZVET_APP_VERSION}</span></div>
          <div className="flex justify-end w-full">
            <Settings />
          </div>
        </div>
      </div>
    </header>
  );
}
