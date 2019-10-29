var queryTypes = {
    greaterThen: ">",
    greaterThenOrEqual: ">=",
    smallerThen: "<",
    smallerThenOrEqual: "<=",
    equal: "===",
    between: "<>",
    like: "%%",
    not: {
        greaterThen: "<=",
        greaterThenOrEqual: "<",
        smallerThen: ">=",
        smallerThenOrEqual: ">",
        equal: "!==",
        between: "!<>",
        like: "!%%",
    }
}

type operator = ">" |
    ">=" |
    "<" |
    "<=" |
    "===" |
    "!==" |
    "<>" |
    "%%" |
    "!<>" |
    "!%%"

const betweenMethod = (queryValue: [number | Date, number | Date], value: number | Date): boolean => value >= queryValue[0] && value <= queryValue[1]
const likeMethod = (queryValue: any, value: any): boolean => value.toString().includes(queryValue)
const operatorMethods = {
    ">": (queryValue: number | Date, value: number | Date): boolean => value > queryValue,
    ">=": (queryValue: number | Date, value: number | Date): boolean => value >= queryValue,
    "<": (queryValue: number | Date, value: number | Date): boolean => value < queryValue,
    "<=": (queryValue: number | Date, value: number | Date): boolean => value <= queryValue,
    "===": (queryValue: number | Date, value: number | Date): boolean => value === queryValue,
    "!==": (queryValue: number | Date, value: number | Date): boolean => value !== queryValue,
    "<>": betweenMethod,
    "%%": likeMethod,
    "!<>": (queryValue: [number | Date, number | Date], value: number | Date): boolean => !betweenMethod(queryValue, value),
    "!%%": (queryValue: any, value: any): boolean => !likeMethod(queryValue, value)
}

interface FilterOptions {
    items: Array<Object>,
    where: any
}
const applyFilter = (filterOptions: FilterOptions) => {
    const keys = Object.keys(filterOptions.where)
    if (filterOptions.where) {
        return filterOptions.items.filter((item: any) => {
            return keys.every((key: string) => {
                if (!item[key]) {
                    return true
                }
                const { operator, value }: { operator: operator, value: any } = filterOptions.where[key]
                if (operator) {
                    return operatorMethods[operator](value, item[key])
                }
                return filterOptions.where[key] === item[key];
            })
        })
    }

}

console.log(new Date())

console.time("A")
const result = applyFilter({
    items: [{
        name: "Teng",
        age: 9,
        date: "Sun Oct 27 2019 09:25:07 GMT+0100 (GMT+01:00)"
    }, {
        name: "Tewg",
        age: 8,
        date: "Sun Oct 17 2019 09:25:07 GMT+0100 (GMT+01:00)"
    }, {
        name: "Teng",
        age: 8,
        date: "Sun Oct 25 2019 09:25:07 GMT+0100 (GMT+01:00)"
    }, {
        name: "Teng",
        age: 4,
        date: "Sun Oct 29 2019 09:25:07 GMT+0100 (GMT+01:00)"
    }],
    where: {
        // age: {
        //     operator: queryTypes.between,
        //     value: ["Teng", "jip"]
        // },
        // name: {
        //     operator: queryTypes.not.equal,
        //     value: "Teng"
        // },
        date:{
            operator: queryTypes.greaterThen,
            value: new Date()
        }
    }
})
// console.log(getFilteredItems())
console.timeEnd("A")