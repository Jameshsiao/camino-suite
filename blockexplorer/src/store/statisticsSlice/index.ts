import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store/configureStore";
import { Status } from "types";
import { initialStatisticsType } from "../../types/store";
import {
  loadDailyEmissions,
  loadNetworkEmissions,
  loadTransactionsEmissions,
  loadDailyTransactionsStatistics,
  loadUniqueAddresses
} from "./utils";
import MeterCO2Data from '../../types/meterCO2data';

let initialStateCO2Data: MeterCO2Data = {
  Name: "",
  Value: []
};

let initialState: initialStatisticsType = {
  dailyEmissions: initialStateCO2Data,
  dailyEmissionsStatus: Status.IDLE,
  networkEmissions: initialStateCO2Data,
  networkEmissionsStatus: Status.IDLE,
  transactionsEmissions: initialStateCO2Data,
  transactionsEmissionsStatus: Status.IDLE,
  carbonIntensityFactor: {},
  carbonIntensityFactorStatus: Status.IDLE,
  transactionsPerDay: null,
  transactionsPerDayLoading: Status.IDLE,
  uniqueAddressesInfo: null,
  uniqueAddressesInfoLoading: Status.IDLE
};

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    statisticsReducer: () => initialState,
  },
  extraReducers(builder) {

    //Daily Emissions
    builder.addCase(loadDailyEmissions.pending, (state) => {
      state.dailyEmissionsStatus = Status.LOADING;
    });
    builder.addCase(loadDailyEmissions.fulfilled, (state, { payload }) => {
      let data: any = payload;
      state.dailyEmissions = data;
      state.dailyEmissionsStatus = Status.SUCCEEDED;
    });
    builder.addCase(loadDailyEmissions.rejected, (state) => {
      state.dailyEmissionsStatus = Status.FAILED;
    });

    //Network Emissions
    builder.addCase(loadNetworkEmissions.pending, (state) => {
      state.networkEmissionsStatus = Status.LOADING;
    });
    builder.addCase(loadNetworkEmissions.fulfilled, (state, { payload }) => {
      let data: any = payload;
      state.networkEmissions = data;
      state.networkEmissionsStatus = Status.SUCCEEDED;
    });
    builder.addCase(loadNetworkEmissions.rejected, (state) => {
      state.networkEmissionsStatus = Status.FAILED;
    });

    //Transactions Emissions
    builder.addCase(loadTransactionsEmissions.pending, (state) => {
      state.transactionsEmissionsStatus = Status.LOADING;
    });
    builder.addCase(loadTransactionsEmissions.fulfilled, (state, { payload }) => {
      let data: any = payload;
      state.transactionsEmissions = data;
      state.transactionsEmissionsStatus = Status.SUCCEEDED;
    });
    builder.addCase(loadTransactionsEmissions.rejected, (state) => {
      state.transactionsEmissionsStatus = Status.FAILED;
    });

    builder.addCase(loadDailyTransactionsStatistics.pending, (state) => {
      state.transactionsPerDayLoading = Status.LOADING;
    });
    builder.addCase(loadDailyTransactionsStatistics.fulfilled, (state, { payload }) => {
      let data: any = payload;
      state.transactionsPerDay = data;
      state.transactionsPerDayLoading = Status.SUCCEEDED;
    });
    builder.addCase(loadDailyTransactionsStatistics.rejected, (state) => {
      state.transactionsPerDayLoading = Status.FAILED;
    });

    //Unique Addreses Info
    builder.addCase(loadUniqueAddresses.pending, (state) => {
      state.uniqueAddressesInfoLoading = Status.LOADING;
    });
    builder.addCase(loadUniqueAddresses.fulfilled, (state, { payload }) => {
      let data: any = payload;
      state.uniqueAddressesInfo = data;
      state.uniqueAddressesInfoLoading = Status.SUCCEEDED;
    });
    builder.addCase(loadUniqueAddresses.rejected, (state) => {
      state.uniqueAddressesInfoLoading = Status.FAILED;
    });

  },
});

export const getDailyEmissions = (state: RootState) => state.statistics.dailyEmissions;
export const getDailyEmissionsStatus = (state: RootState) => state.statistics.dailyEmissionsStatus;

export const getNetworkEmissions = (state: RootState) => state.statistics.networkEmissions;
export const getNetworkEmissionsStatus = (state: RootState) => state.statistics.networkEmissionsStatus;

export const getTransactionsEmissions = (state: RootState) => state.statistics.transactionsEmissions;
export const getTransactionsEmissionsStatus = (state: RootState) => state.statistics.transactionsEmissionsStatus;

export const getTransactionsPerDay = (state: RootState) => state.statistics.transactionsPerDay;
export const getTransactionsPerDayStatus = (state: RootState) => state.statistics.transactionsPerDayLoading;

export const getUniqueAddresses = (state: RootState) => state.statistics.uniqueAddressesInfo;
export const getUniqueAddressesLoading = (state: RootState) => state.statistics.uniqueAddressesInfoLoading;

export const {
  statisticsReducer
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
