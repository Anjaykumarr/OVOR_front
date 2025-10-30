import api from "../../api/axiosClient";


export const routes = {


    // This api is to get District data from browser geolocation
    async getDistricts(Lat, Lon) {

        //old way
        //const response = await api.get("/routes");
        //const data = response.data;

        const { data } = await api.post("api/mgnrega/GetAutoLocation", { Lat, Lon });
        return data;
    },

    async getStateList() {
        const { data } = await api.post("api/mgnrega/GetStateList")
        return data;
    },

    async getDistrictList(Name) {
        const { data } = await api.post("api/mgnrega/GetDistrictList", { Name })
        return data;
    },

    async getDistrictDashboardData(Data) {
        const { data } = await api.post("api/mgnrega/GetDistrictDashboardData", { Data })
        return data;
    },

    async GetMonth() {
        const { data } = await api.post("api/mgnrega/GetMonth")
        return data;
    },

    async GetYear() {
        const { data } = await api.post("api/mgnrega/GetYear")
        return data;
    },

    async GetMetric() {
        const { data } = await api.post("api/mgnrega/GetMetric")
        return data;
    },

    async GetChartData(district, metric, year) {
        const { data } = await api.post("api/mgnrega/GetChartData", { district, metric, year })
        return data;
    },

    async WageOverTime(district) {
        const { data } = await api.post("api/mgnrega/WageOverTime", { district })
        return data;
    }

}