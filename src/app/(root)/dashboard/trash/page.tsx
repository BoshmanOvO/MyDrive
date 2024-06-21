"use client";
import React from "react";
import RightSidebar from "@/components/RightSidebar";

const Page = () => {
	return (
		<main className="container mx-auto pt-12">
			<div className={"flex"}>
				<RightSidebar title={"Trash"} />
				{/*<SearchBar query={query} setQuery={setQuery} />*/}
			</div>
		</main>
	);
};

export default Page;
