import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { InfoIcon, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@workspace/ui/components/card";
import { ReactNode } from "react";

export interface FilteringParams {
    children?: ReactNode;
}

function Filtering({
    children
}: FilteringParams) {
    // State to manage filter visibility
    const [isFilterVisible, setIsFilterVisible] = useState<boolean>(true);

    // Toggle filter visibility
    const toggleFilterVisibility = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    return (
        <Card className="shadow-md">
            <CardHeader className="text-primary flex flex-row justify-between items-center">
                <CardTitle className="font-semibold flex items-center">
                    <Filter className="primary w-5 h-5 mr-2" />
                    Filter Options
                </CardTitle>

                {/* Toggle Button for Filters */}
                <button
                    onClick={toggleFilterVisibility}
                    className="flex items-center space-x-2 p-2 rounded-md hover:text-accent"
                >
                    {isFilterVisible ? (
                        <>
                            <ChevronUp className="h-4 w-4" />
                            <span className="text-sm">Hide Filters</span>
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-4 w-4" />
                            <span className="text-sm">Show Filters</span>
                        </>
                    )}
                </button>
            </CardHeader>

            {/* Conditionally render filter content */}
            {isFilterVisible && (
                <CardContent className="pt-6">
                    <div className="w-full space-y-6">
                        <Alert className="bg-secondary/10 dark:bg-secondary/5 border-primary dark:border-primary/60">
                            <InfoIcon className="h-5 w-5 text-primary dark:text-primary/80" />
                            <AlertTitle className="text-primary dark:text-primary/80 font-semibold">
                                Filter Instructions
                            </AlertTitle>
                            <AlertDescription className="text-gray-700 dark:text-gray-300">
                                Select filters to display matching data. Combine multiple filters for more precise results.
                            </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {/* Render children filters */}
                            {children}
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

export default Filtering;