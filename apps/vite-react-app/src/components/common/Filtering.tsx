import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { Info, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@workspace/ui/components/card";
import { ReactNode } from "react";

export interface FilteringParams {
    children?: ReactNode;
}

function Filtering({
    children
}: FilteringParams) {
    // State untuk mengelola visibilitas filter
    const [isFilterVisible, setIsFilterVisible] = useState<boolean>(true);

    // Toggle visibilitas filter
    const toggleFilterVisibility = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    return (
        <Card className="shadow-md">
            <CardHeader className="text-primary flex flex-row justify-between items-center">
                <CardTitle className="font-semibold flex items-center">
                    <Filter className="primary w-5 h-5 mr-2" />
                    Opsi Filter
                </CardTitle>

                {/* Tombol Toggle untuk Filter */}
                <button
                    onClick={toggleFilterVisibility}
                    className="flex items-center space-x-2 p-2 rounded-md hover:text-accent"
                >
                    {isFilterVisible ? (
                        <>
                            <ChevronUp className="h-4 w-4" />
                            <span className="text-sm">Sembunyikan Filter</span>
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-4 w-4" />
                            <span className="text-sm">Tampilkan Filter</span>
                        </>
                    )}
                </button>
            </CardHeader>

            {/* Render konten filter secara kondisional */}
            {isFilterVisible && (
                <CardContent className="pt-6">
                    <div className="w-full space-y-6">
                        <Alert className="bg-secondary/10 dark:bg-secondary/5 border-primary dark:border-primary/60">
                            <Info className="h-5 w-5 text-primary dark:text-primary/80" />
                            <AlertTitle className="text-primary dark:text-primary/80 font-semibold">
                                Petunjuk Filter
                            </AlertTitle>
                            <AlertDescription className="text-gray-700 dark:text-gray-300">
                                Pilih filter untuk menampilkan data yang sesuai. Gabungkan beberapa filter untuk hasil yang lebih akurat.
                            </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {/* Render children filter */}
                            {children}
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

export default Filtering;