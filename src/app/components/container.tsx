import React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
	children: React.ReactNode;
	className?: string;
};

const Container: React.FC<ContainerProps> = ({ children, className }) => {
	return (
		<div className={cn("max-w-4xl w-full  mx-auto bg-white p-4 md:px-18", className)}>
			{children}
		</div>
	);
};

export default Container;