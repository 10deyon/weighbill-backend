import { Helpers } from "src/shared/helpers/utitlity.helpers";
import { GenericMatch } from "../classes";

export const handlePagination = (page: number, limit: number): { page: number, limit: number } => {
    return { page: +(page ?? 1), limit: +(limit ?? 10) }
}

export const paginate = (limit: number, page: number, route: string, items) => { //}: { totalPages: number, totalCount: number } => {
// export const paginate = (total: GenericMatch[], limit: number, page: number, route: string, items) => { //}: { totalPages: number, totalCount: number } => {
    const { count } = items ? items[0].total : 0;
    const totalPages: number = count ? Math.ceil(count / limit) : 0
    const totalCount: number = count ? count : 0;
    
    return {
        links: {
            first: route + `?limit=${limit}`,
            previous: route + ``,
            next:  page > limit ? `${route}?limit=${limit}&page=${Number(page) + 1}` : null,
            last: page > limit ? `${route}?limit=${limit}&page=${count / Number(limit)}` : null 
        },
        
        data: items[0].result,
        
        meta: {
            currentPage: Number(page),
            itemCount: items.length,
            itemsPerPage: Number(limit),
            total: totalCount,
            totalPages: totalPages
        }
    }
}

export const handleArraySearch = (data: (string | number)[], searchFieldName: string): GenericMatch => {
    return Array.isArray(data) && !!data.length
        ? { [searchFieldName]: { $in: data } }
        : {};
}

export const handleSearchTerm = (searchTerm: string, searchFieldName: string) => {
    return !!searchTerm
        ? { [searchFieldName]: { $regex: `^${searchTerm}`/*, $options: "si"*/ } }
        : {};
}

export const handleFilterExact = (searchTerm: string, searchFieldName: string) => {
    return !!searchTerm
        ? { [searchFieldName]: searchTerm }
        : {};
}

export const getAmount = (value) => {
    if (typeof value !== 'undefined') {
        return parseFloat(value);
    }
    return value;
};

export const datesFilterQuery: (startDateString: string, dateFieldName: string, endDateString: string,) => { [key: string]: { $gte: Date, $lte: Date } }
    = (startDateString: string, endDateString: string, dateFieldName: string) => {
        if (!startDateString || !endDateString) {
            return {};
        }

        const startDate: Date = new Date(startDateString);
        const endDate: Date = new Date(endDateString)

        return {
            [dateFieldName]: {
                $gte: startDate,
                $lte: endDate,
            }
        };
    }

export const datesFilterQuerys: (scheduleDate: string, dateFieldName: string,) => { [key: string]: { $gt: Date, $lte: Date } }
    = (scheduleDate: string, dateFieldName: string) => {
        if (!scheduleDate) {
            return {};
        }
        const scheduleDateQuery = new Date(scheduleDate)
        const startDate: Date = new Date(Helpers.subtractDaysFromDate(0, scheduleDateQuery).setHours(0, 59, 59, 999));
        const endDate: Date = new Date(Helpers.addDaysToDate(1, scheduleDateQuery).setHours(0, 59, 59, 999));
        return {
            [dateFieldName]: {
                $gt: startDate,
                $lte: endDate,
            }
        };
    }

export const locationFilterQuery = (locationPolygon: [[[number]]], locationFieldName: string) => {
    if (!locationPolygon) {
        return {};
    }

    return {
        [locationFieldName]: {
            $geoWithin: {
                $geometry: {
                    type: "Polygon",
                    coordinates: locationPolygon
                }
            }
        }
    }
}

export const handleOrQuery = (searchTerm: string, ...fieldNames: string[]) => {
    if (!searchTerm) {
        return {};
    }

    return {
        $or: fieldNames.map(field => {
            if (field === 'requestId') {
                return { ...handleSearchTerm(searchTerm.toUpperCase(), field) }
            }
            if (field.includes('regNumber')) {
                return { ...handleSearchTerm(searchTerm.toUpperCase(), field) }
            }
            if (field.includes('businessName')) {
                return { ...handleSearchTerm(searchTerm.toLowerCase(), field) }
            }
            if (field.includes('firstName') || field.includes('lastName')) {
                return { ...handleSearchTerm(searchTerm.toLowerCase(), field) }
            }
            return { ...handleSearchTerm(searchTerm, field) }
        })
    }
}

export const handleMultipleMatch = (fieldName: string, ...values: string[]) => {
    if (!fieldName) {
        return {}
    }
    return {
        [fieldName]: { $nin: [...values] }
    }
}
function Mathceil(arg0: number) {
    throw new Error("Function not implemented.");
}

