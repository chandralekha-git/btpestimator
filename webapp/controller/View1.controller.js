sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageItem",
    "sap/m/MessagePopover",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet'

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageItem, MessagePopover, MessageBox, Fragment, JSONModel, exportLibrary, Spreadsheet) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        var Finalcomplexity, Effortsinhrs, finalTotalWeight, flagSave = 0;
        var oData = {
            Objects: [
                {
                    "Complexity": "Low",
                    "R": 0,
                    "I": 0,
                    "C": 0,
                    "E": 0,
                    "F": 0,
                    "W": 0,
                    "T": 0,
                    "EF": 0
                },
                {
                    "Complexity": "Medium",
                    "R": 0,
                    "I": 0,
                    "C": 0,
                    "E": 0,
                    "F": 0,
                    "W": 0,
                    "T": 0,
                    "EF": 0
                },
                {
                    "Complexity": "Complex",
                    "R": 0,
                    "I": 0,
                    "C": 0,
                    "E": 0,
                    "F": 0,
                    "W": 0,
                    "T": 0,
                    "EF": 0
                },
                {
                    "Complexity": "V Complex",
                    "R": 0,
                    "I": 0,
                    "C": 0,
                    "E": 0,
                    "F": 0,
                    "W": 0,
                    "T": 0,
                    "EF": 0
                },
                {
                    "Complexity": "Total",
                    "R": 0,
                    "I": 0,
                    "C": 0,
                    "E": 0,
                    "F": 0,
                    "W": 0,
                    "T": 0,
                    "EF": 0
                }

            ]
        }
        var oModelSubObjDataG = new JSONModel();
        return Controller.extend("zsap.ui5.btpestimator.controller.View1", {
            onInit: function () {
                var oModelSumRep = new JSONModel(oData);
                this.getView().setModel(oModelSumRep, "oModelSumRep");
            },
            onBeforeRendering: function () {
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var that = this;
                var sUrl = path + "catalog/Projects";
                var oModelProj = new sap.ui.model.json.JSONModel({
                    "attr": []
                });
                // sap.ui.core.BusyIndicator.show(0);
                this.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    method: "GET",
                    async: true,
                    success: function (oResponse) {

                        //  sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        oModelProj.setProperty("/attr", oResponse.value);
                        that.getView().setModel(oModelProj, "oModelProj");
                    },
                    error: function (oResponse) {
                        // sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        MessageBox.error(oResponse.responseText);
                    }
                });
            },
            onPressAddNewPrj: function (oEvent) {
                var comboBoxProj = this.getView().byId("comboBoxProj").getValue();
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var that = this;
                var payload = JSON.stringify({ "projectName": comboBoxProj });
                var sUrl = path + "catalog/Projects";
                //    sap.ui.core.BusyIndicator.show(0);
                this.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    headers: { "Content-Type": "application/json" },
                    method: "POST",
                    data: payload,
                    success: function (oResponse) {
                        //  sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        that.onBeforeRendering();
                        // that.onSelectProjectType();
                        MessageBox.information("New Project created successfully!!!");
                        var sUrl = path + "catalog/Objects?$filter=projectID eq '" + prjtid + "'";
                        var oModelObj = new sap.ui.model.json.JSONModel({
                            "attr": []
                        });
                        //  sap.ui.core.BusyIndicator.show(0);
                        this.getView().setBusy(true);
                        jQuery.ajax({
                            url: sUrl,
                            headers: { "Content-Type": "application/json" },
                            method: "GET",
                            data: payload,
                            async: true,
                            success: function (oResponse) {

                                // sap.ui.core.BusyIndicator.hide();
                                that.getView().setBusy(false);
                                oModelObj.setProperty("/attr", oResponse.value);
                                that.getView().setModel(oModelObj, "oModelObj");

                                var dataModelsumRep = that.getView().getModel("oModelSumRep");
                                if (dataModelsumRep) {
                                    dataModelsumRep.setData(oData);
                                    dataModelsumRep.updateBindings(true);
                                }
                                that.getView().byId("idComboBox").setEnabled(false);
                                that.getView().byId("idComboBox").setSelectedKey("");
                                that.getView().byId("idRefreshB").setEnabled(false);
                                that.getView().byId("idSaveB").setEnabled(false);
                                var dataModel = that.getView().byId("idProductsTable").getModel("oModelTable");
                                if (dataModel) {
                                    dataModel.setData(null);
                                    dataModel.updateBindings(true);
                                }
                                var dataModelCompdet = that.getView().getModel("oModelCompdet");
                                if (dataModelCompdet) {
                                    dataModelCompdet.setData(null);
                                    dataModelCompdet.updateBindings(true);
                                }
                                that.getView().byId("comboBoxObj").setValue("");
                                that.getView().byId("comboBoxSubObj").setValue("");
                            },
                            error: function (oResponse) {
                                that.getView().setBusy(false);
                                //  sap.ui.core.BusyIndicator.hide();

                            }
                        });
                        that.getView().getModel("oModelProj").refresh();

                    },
                    error: function (oResponse) {
                        // sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        if (oResponse.responseJSON.error.message !== "")
                            MessageBox.error(oResponse.responseJSON.error.message);
                        else
                            MessageBox.error("Cannot create new Project!!");
                    }
                });
            },
            onSelectProjectType: function () {
                var prjtid;
                //   prjtid = this.getView().byId("comboBoxProj").getSelectedKey();
                var prjname = this.getView().byId("comboBoxProj").getValue();
                var oModelProjData = this.getView().getModel("oModelProj").getData().attr;
                for (var index = 0; index < oModelProjData.length; index++) {
                    var prj = oModelProjData[index].projectName;
                    if (prjname === prj) {
                        prjtid = oModelProjData[index].projectID;
                    }
                }
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var payload = JSON.stringify(prjtid);
                var that = this;
                var sUrl = path + "catalog/Objects?$filter=projectID eq '" + prjtid + "'";
                var oModelObj = new sap.ui.model.json.JSONModel({
                    "attr": []
                });
                //  sap.ui.core.BusyIndicator.show(0);
                this.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    headers: { "Content-Type": "application/json" },
                    method: "GET",
                    data: payload,
                    async: true,
                    success: function (oResponse) {

                        // sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        oModelObj.setProperty("/attr", oResponse.value);
                        that.getView().setModel(oModelObj, "oModelObj");

                        var dataModelsumRep = that.getView().getModel("oModelSumRep");
                        if (dataModelsumRep) {
                            dataModelsumRep.setData(oData);
                            dataModelsumRep.updateBindings(true);
                        }
                        that.getView().byId("idComboBox").setEnabled(false);
                        that.getView().byId("idComboBox").setSelectedKey("");
                        that.getView().byId("idRefreshB").setEnabled(false);
                        that.getView().byId("idSaveB").setEnabled(false);
                        var dataModel = that.getView().byId("idProductsTable").getModel("oModelTable");
                        if (dataModel) {
                            dataModel.setData(null);
                            dataModel.updateBindings(true);
                        }
                        var dataModelCompdet = that.getView().getModel("oModelCompdet");
                        if (dataModelCompdet) {
                            dataModelCompdet.setData(null);
                            dataModelCompdet.updateBindings(true);
                        }
                        that.getView().byId("comboBoxObj").setValue("");
                        that.getView().byId("comboBoxSubObj").setValue("");
                        //  var sUrl = path + "catalog/SubObjects?$filter=projectID eq '" + prjtid + "' and objectID eq '" + objID + "'";
                        //var oModelSubObj = new sap.ui.model.json.JSONModel({
                        //   "attr": []
                        // });
                        //sap.ui.core.BusyIndicator.show(0);
                        //   this.getView().setBusy(true);
                        /*  jQuery.ajax({
                              url: sUrl,
                              headers: { "Content-Type": "application/json" },
                              method: "GET",
                              async: true,
                              success: function (oResponse) {
  
                                  // sap.ui.core.BusyIndicator.hide();
                                  that.getView().setBusy(false);
                                  that.getView().byId("comboBoxSubObj").setValue("");
                                  oModelSubObj.setProperty("/attr", oResponse.value);
                                  that.getView().setModel(oModelSubObj, "oModelSubObj");
                              },
                              error: function (oResponse) {
                                  //sap.ui.core.BusyIndicator.hide();
                                  that.getView().setBusy(false);
                              }
                          });*/

                    },
                    error: function (oResponse) {
                        that.getView().setBusy(false);
                        //  sap.ui.core.BusyIndicator.hide();

                    }
                });

            },
            onPressAddNewObj: function (oEvent) {
                var comboBoxProj;
                var prjname = this.getView().byId("comboBoxProj").getValue();
                var oModelProjData = this.getView().getModel("oModelProj").getData().attr;
                for (var index = 0; index < oModelProjData.length; index++) {
                    var prj = oModelProjData[index].projectName;
                    if (prjname === prj) {
                        comboBoxProj = oModelProjData[index].projectID;
                    }
                }
                var comboBoxObjval = this.getView().byId("comboBoxObj").getValue();
                var objtype = this.getView().byId("idSelectType").getSelectedKey();
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var that = this;
                var payload = JSON.stringify({ "projectID": comboBoxProj, "objectName": comboBoxObjval, "objectType": objtype });
                var sUrl = path + "catalog/Objects";
                //sap.ui.core.BusyIndicator.show(0);
                this.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    headers: { "Content-Type": "application/json" },
                    method: "POST",
                    data: payload,
                    async: true,
                    success: function (oResponse) {

                        //   sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        MessageBox.information("New Object ID created successfully!!!");
                        var sUrl = path + "catalog/Objects?$filter=projectID eq '" + comboBoxProj + "'";
                        var oModelObj = new sap.ui.model.json.JSONModel({
                            "attr": []
                        });
                        //  sap.ui.core.BusyIndicator.show(0);
                        that.getView().setBusy(true);
                        jQuery.ajax({
                            url: sUrl,
                            headers: { "Content-Type": "application/json" },
                            method: "GET",
                            data: payload,
                            async: true,
                            success: function (oResponse) {

                                // sap.ui.core.BusyIndicator.hide();
                                that.getView().setBusy(false);
                                oModelObj.setProperty("/attr", oResponse.value);
                                that.getView().setModel(oModelObj, "oModelObj");

                                var dataModelsumRep = that.getView().getModel("oModelSumRep");
                                if (dataModelsumRep) {
                                    dataModelsumRep.setData(oData);
                                    dataModelsumRep.updateBindings(true);
                                }
                                that.getView().byId("idComboBox").setEnabled(false);
                                that.getView().byId("idComboBox").setSelectedKey("");
                                that.getView().byId("idRefreshB").setEnabled(false);
                                that.getView().byId("idSaveB").setEnabled(false);
                                var dataModel = that.getView().byId("idProductsTable").getModel("oModelTable");
                                if (dataModel) {
                                    dataModel.setData(null);
                                    dataModel.updateBindings(true);
                                }
                                var dataModelCompdet = that.getView().getModel("oModelCompdet");
                                if (dataModelCompdet) {
                                    dataModelCompdet.setData(null);
                                    dataModelCompdet.updateBindings(true);
                                }
                                that.getView().byId("comboBoxSubObj").setValue("");
                                var sUrl = path + "catalog/SubObjects?$filter=projectID eq '" + prjtid + "' and objectID eq '" + objID + "'";
                                var oModelSubObj = new sap.ui.model.json.JSONModel({
                                    "attr": []
                                });
                                //sap.ui.core.BusyIndicator.show(0);
                                this.getView().setBusy(true);
                                jQuery.ajax({
                                    url: sUrl,
                                    headers: { "Content-Type": "application/json" },
                                    method: "GET",
                                    async: true,
                                    success: function (oResponse) {

                                        // sap.ui.core.BusyIndicator.hide();
                                        that.getView().setBusy(false);
                                        that.getView().byId("comboBoxSubObj").setValue("");
                                        oModelSubObj.setProperty("/attr", oResponse.value);
                                        that.getView().setModel(oModelSubObj, "oModelSubObj");
                                    },
                                    error: function (oResponse) {
                                        //sap.ui.core.BusyIndicator.hide();
                                        that.getView().setBusy(false);
                                    }
                                });

                            },
                            error: function (oResponse) {
                                that.getView().setBusy(false);
                                //  sap.ui.core.BusyIndicator.hide();

                            }
                        });
                        that.getView().getModel("oModelObj").refresh();
                        /*that.getView().byId("idComboBox").setEnabled(false);
                        that.getView().byId("idRefreshB").setEnabled(false);
                        that.getView().byId("idSaveB").setEnabled(false);
                        var dataModel = that.getView().byId("idProductsTable").getModel("oModelTable");
                        if (dataModel) {
                            dataModel.setData(null);
                            dataModel.updateBindings(true);
                        }
                        var dataModelCompdet = that.getView().getModel("oModelCompdet");
                        if (dataModelCompdet) {
                            dataModelCompdet.setData(null);
                            dataModelCompdet.updateBindings(true);
                        } */

                    },
                    error: function (oResponse) {

                        //   sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        if (oResponse.responseJSON.error.message !== "")
                            MessageBox.error(oResponse.responseJSON.error.message);
                        else
                            MessageBox.error("Cannot create new object ID!");
                    }
                });
            },
            onSelectionChangeObj: function () {
                var prjtid;
                var prjname = this.getView().byId("comboBoxProj").getValue();
                var oModelProjData = this.getView().getModel("oModelProj").getData().attr;
                for (var index = 0; index < oModelProjData.length; index++) {
                    var prj = oModelProjData[index].projectName;
                    if (prjname === prj) {
                        prjtid = oModelProjData[index].projectID;
                    }
                }

                var objID;
                var objectname = this.getView().byId("comboBoxObj").getValue();
                var oModelObjData = this.getView().getModel("oModelObj").getData().attr;
                for (var index = 0; index < oModelObjData.length; index++) {
                    var ObjectID = oModelObjData[index].objectName;
                    if (objectname === ObjectID) {
                        objID = oModelObjData[index].objectID;
                        this.getView().byId("idSelectType").setSelectedKey(oModelObjData[index].objectType);
                    }
                }

                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var that = this;
                var sUrl = path + "catalog/SubObjects?$filter=projectID eq '" + prjtid + "' and objectID eq '" + objID + "'";
                var oModelSubObj = new sap.ui.model.json.JSONModel({
                    "attr": []
                });
                //sap.ui.core.BusyIndicator.show(0);
                this.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    headers: { "Content-Type": "application/json" },
                    method: "GET",
                    async: true,
                    success: function (oResponse) {

                        // sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        that.getView().byId("comboBoxSubObj").setValue("");
                        that.getView().byId("idComboBox").setSelectedKey("");
                        var dataModel = that.getView().byId("idProductsTable").getModel("oModelTable");
                        if (dataModel) {
                            dataModel.setData(null);
                            dataModel.updateBindings(true);
                        }
                        var dataModelCompdet = that.getView().getModel("oModelCompdet");
                        if (dataModelCompdet) {
                            dataModelCompdet.setData(null);
                            dataModelCompdet.updateBindings(true);
                        }
                        oModelSubObj.setProperty("/attr", oResponse.value);
                        that.getView().setModel(oModelSubObj, "oModelSubObj");
                    },
                    error: function (oResponse) {
                        //sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                    }
                });

            },
            onPressAddNewSubObj: function (oEvent) {
                var comboBoxProj;
                var prjname = this.getView().byId("comboBoxProj").getValue();
                var oModelProjData = this.getView().getModel("oModelProj").getData().attr;
                for (var index = 0; index < oModelProjData.length; index++) {
                    var prj = oModelProjData[index].projectName;
                    if (prjname === prj) {
                        comboBoxProj = oModelProjData[index].projectID;
                    }
                }
                var comboBoxObjval;
                var objectname = this.getView().byId("comboBoxObj").getValue();
                var oModelObjData = this.getView().getModel("oModelObj").getData().attr;
                for (var index = 0; index < oModelObjData.length; index++) {
                    var ObjectID = oModelObjData[index].objectName;
                    if (objectname === ObjectID) {
                        comboBoxObjval = oModelObjData[index].objectID;
                    }
                }
                var comboBoxSubObj = this.getView().byId("comboBoxSubObj").getValue();
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var that = this;
                var payload = JSON.stringify({ "projectID": comboBoxProj, "objectID": comboBoxObjval, "subObjectType": comboBoxSubObj });
                var sUrl = path + "catalog/SubObjects";
                //  sap.ui.core.BusyIndicator.show(0);
                this.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    headers: { "Content-Type": "application/json" },
                    method: "POST",
                    data: payload,
                    success: function (oResponse) {
                        that.getView().setBusy(false);
                        //  sap.ui.core.BusyIndicator.hide();
                        that.getView().byId("idComboBox").setEnabled(true);
                        that.getView().byId("idComboBox").setSelectedKey("");
                        that.getView().byId("idRefreshB").setEnabled(true);
                        that.getView().byId("idSaveB").setEnabled(true);
                        var dataModel = that.getView().byId("idProductsTable").getModel("oModelTable");
                        if (dataModel) {
                            dataModel.setData(null);
                            dataModel.updateBindings(true);
                        }
                        var dataModelCompdet = that.getView().getModel("oModelCompdet");
                        if (dataModelCompdet) {
                            dataModelCompdet.setData(null);
                            dataModelCompdet.updateBindings(true);
                        }
                        MessageBox.information("New Sub-Object ID created successfully!!!");
                        var sUrl = path + "catalog/SubObjects?$filter=projectID eq '" + comboBoxProj + "' and objectID eq '" + comboBoxObjval + "'";
                        var oModelSubObj = new sap.ui.model.json.JSONModel({
                            "gattr": []
                        });
                        //sap.ui.core.BusyIndicator.show(0);
                        that.getView().setBusy(true);
                        jQuery.ajax({
                            url: sUrl,
                            headers: { "Content-Type": "application/json" },
                            method: "GET",
                            async: true,
                            success: function (oResponse) {

                                // sap.ui.core.BusyIndicator.hide();
                                that.getView().setBusy(false);
                               // that.getView().byId("comboBoxSubObj").setValue("");
                                oModelSubObj.setProperty("/attr", oResponse.value);
                                that.getView().setModel(oModelSubObj, "oModelSubObj");
                            },
                            error: function (oResponse) {
                                //sap.ui.core.BusyIndicator.hide();
                                that.getView().setBusy(false);
                            }
                        });
                        that.getView().getModel("oModelSubObj").refresh();

                    },
                    error: function (oResponse) {
                        that.getView().byId("idComboBox").setEnabled(false);
                        that.getView().byId("idRefreshB").setEnabled(false);
                        that.getView().byId("idSaveB").setEnabled(false);
                        // that.onSelectionChangeObj();
                        // sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        if (oResponse.responseJSON.error.message !== "")
                            MessageBox.error(oResponse.responseJSON.error.message);

                        else
                            MessageBox.error("cannot create sub-object ID!!");

                    }
                });
            },
            onSelectionChangeSubObj: function () {
                // this.getView().byId("idComboBox").setEnabled(false);
                var tempArray = [];
                var flag = 1, res;
                var oModelTable = this.getView().byId("idProductsTable").getModel("oModelTable");
                if (oModelTable === undefined) {
                    oModelTable = new sap.ui.model.json.JSONModel({
                        "attr": []
                    });
                }
                var oModelCompdet = new sap.ui.model.json.JSONModel({
                    "attr": []
                });
                var projtid;

                var prjname = this.getView().byId("comboBoxProj").getValue();
                var oModelProjData = this.getView().getModel("oModelProj").getData().attr;
                for (var index = 0; index < oModelProjData.length; index++) {
                    var prj = oModelProjData[index].projectName;
                    if (prjname === prj) {
                        projtid = oModelProjData[index].projectID;
                    }
                }

                var objectid;

                var objectname = this.getView().byId("comboBoxObj").getValue();
                var oModelObjData = this.getView().getModel("oModelObj").getData().attr;
                for (var index = 0; index < oModelObjData.length; index++) {
                    var ObjectID = oModelObjData[index].objectName;
                    if (objectname === ObjectID) {
                        objectid = oModelObjData[index].objectID;
                    }
                }

                var subobjid;

                var subobjname = this.getView().byId("comboBoxSubObj").getValue();
                var oModelSubObjData = this.getView().getModel("oModelSubObj").getData().attr;
                for (var index = 0; index < oModelSubObjData.length; index++) {
                    var subObjectID = oModelSubObjData[index].subObjectType;
                    if (subobjname === subObjectID) {
                        subobjid = oModelSubObjData[index].subObjectID;
                    }
                }

                var riceftype = this.getView().byId("idSelectType").getSelectedKey();
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var that = this;
                var sUrl = path + "catalog/RICEF?$filter=projectID eq '" + projtid + "' and objectID eq '" + objectid + "' and subObjectID eq '" + subobjid + "'";
                //sap.ui.core.BusyIndicator.show(0);
                this.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    method: "GET",
                    success: function (oResponse) {
                        //   sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        for (var i = 0; i < oResponse.value.length; i++) {

                            var type = oResponse.value[i].complexityID;
                            var str = type.substring(0, 3);
                            //   if (selectedKey.startsWith(str.substring(0, 3))) {
                            var check = type.charAt(type.length - 1);
                            if (flag === 1) {
                                res = flag;
                                flag = flag + 1;
                            } else if (flag > 1) {
                                res = flag;
                                flag = flag + 1;
                            }
                            // var str2 = type.charAt(type.length-1);
                            if (check !== "H" && check !== "L" && check !== "M" && check !== "V" && check !== "T") {
                                oResponse.value[i].serialNo = res;
                                oResponse.value[i].obwght = oResponse.value[i].oW;
                                tempArray.push(oResponse.value[i]);

                                if (oResponse.value[i].complexityType === "YN" || oResponse.value[i].complexityType === "Y" || oResponse.value[i].complexityType === "N") {
                                    that.getView().byId("cb1").setVisible(true);
                                    if (oResponse.value[i].W1 === 1)
                                        that.getView().byId("cb1").setSelected(true);
                                    else
                                        that.getView().byId("cb1").setSelected(false);
                                    that.getView().byId("si1").setVisible(false);
                                    that.getView().byId("si1").attachChange("onChangeStepInput");
                                } else {
                                    that.getView().byId("cb1").setVisible(false);
                                    that.getView().byId("si1").setVisible(true);
                                    that.getView().byId("si1").attachChange("onChangeStepInput");
                                }
                                //    oModelTable.setProperty("/attr", tempArray);
                                //  that.getView().setModel(oModelTable, "oModelTable");
                                debugger;
                                that.getView().byId("idComboBox").setSelectedKey(oResponse.value[i].appType);
                                oModelTable.setProperty("/attr", tempArray);
                                that.getView().setModel(oModelTable, "oModelTable");

                            }


                        }

                    },
                    error: function (oResponse) {
                        that.getView().setBusy(false);
                        // sap.ui.core.BusyIndicator.hide();
                    }
                });

                var sUrl = path + "catalog/Complexity?$filter=projectID eq '" + projtid + "' and objectID eq '" + objectid + "' and subObjectID eq '" + subobjid + "'";
                // sap.ui.core.BusyIndicator.show(0);
                that.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    method: "GET",
                    success: function (oResponse) {
                        //  sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        oResponse.value[0].finalcomplexity = oResponse.value[0].complexity;
                        oResponse.value[0].totalobtweght = oResponse.value[0].totalWeight;
                        oResponse.value[0].effinhrs = oResponse.value[0].effort;
                        oModelCompdet.setProperty("/attr", oResponse.value[0]);
                        that.getView().setModel(oModelCompdet, "oModelCompdet");
                    },
                    error: function (oResponse) {
                        that.getView().setBusy(false);
                        // sap.ui.core.BusyIndicator.hide();
                    }
                });

            },
            /*  onSelectionChange: function () {
                  var tempArray = [];
                  var flag = 1;
                  var projtid = this.getView().byId("comboBoxProj").getSelectedKey();
                  var objectid = this.getView().byId("comboBoxObj").getSelectedKey();
                  var subobjid = this.getView().byId("comboBoxSubObj").getSelectedKey();
                  var riceftype = this.getView().byId("idSelectType").getSelectedKey();
                  this.getView().byId("si1").setValue(0);
                  var selectedKey = this.getView().byId("idComboBox").getSelectedKey();
                  let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                  var that = this;
                  var sUrl = path + "catalog/Criteria?$filter=proj_projectID eq " + projtid + " and obj_objectID eq " + objectid + " and subObj_subObjectID eq " + subobjid;
  
                  var oModelTable = new sap.ui.model.json.JSONModel({
                      "attr": []
                  });
                  var desc = [];
                  var finalstr;
                  var res;
                  sap.ui.core.BusyIndicator.show(0);
                  jQuery.ajax({
                      url: sUrl,
                      method: "GET",
                      success: function (oResponse) {
                          sap.ui.core.BusyIndicator.hide();
                          for (var i = 0; i < oResponse.value.length; i++) {
  
                              var type = oResponse.value[i].complexityID;
                              var str = type.substring(0, 3);
                              if (str.length <= 3) {
                                  finalstr = selectedKey.startsWith(str.substring(0, 2));
                              } else {
                                  finalstr = selectedKey.startsWith(str.substring(0, 3));
                              }
                              if (finalstr) {
                                  var check = type.charAt(type.length - 1);
                                  if (flag === 1) {
                                      res = flag;
                                      flag = flag + 1;
                                  } else if (flag > 1) {
                                      res = flag;
                                      flag = flag + 1;
                                  }
                                  // var str2 = type.charAt(type.length-1);
                                  if (check !== "H" && check !== "L" && check !== "M" && check !== "V" && check !== "T") {
                                      oResponse.value[i].serialNo = res;
                                      tempArray.push(oResponse.value[i]);
  
                                      if (oResponse.value[i].complexityType === "YN" || oResponse.value[i].complexityType === "Y" || oResponse.value[i].complexityType === "N") {
                                          that.getView().byId("cb1").setVisible(true);
                                          that.getView().byId("si1").setVisible(false);
                                          that.getView().byId("si1").attachChange("onChangeStepInput");
                                      } else {
                                          that.getView().byId("cb1").setVisible(false);
                                          that.getView().byId("si1").setVisible(true);
                                          that.getView().byId("si1").attachChange("onChangeStepInput");
                                      }
                                      oModelTable.setProperty("/attr", tempArray);
                                      that.getView().setModel(oModelTable, "oModelTable");
  
                                  }
  
                              }
                          }
  
                      },
                      error: function (oResponse) {
  
                          sap.ui.core.BusyIndicator.hide();
                      }
                  });
              }, */
            onPressRefreshRecords: function (oEvent) {
                var tempArray = [];
                var flag = 1;
                this.getView().byId("si1").setValue(0);
                var selectedKey = this.getView().byId("idComboBox").getSelectedKey();
                var oModelCompdet = this.getView().getModel("oModelCompdet");
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var that = this;
                var sUrl = path + "catalog/Criteria";

                var oModelTable = new sap.ui.model.json.JSONModel({
                    "attr": []
                });
                var res;
                var finalstr;
                //sap.ui.core.BusyIndicator.show(0);
                that.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    method: "GET",
                    success: function (oResponse) {
                        //  sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        for (var i = 0; i < oResponse.value.length; i++) {

                            var type = oResponse.value[i].complexityID;
                            var str = type.substring(0, 3);
                            if (str.length <= 3) {
                                finalstr = selectedKey.startsWith(str.substring(0, 2));
                            } else {
                                finalstr = selectedKey.startsWith(str.substring(0, 3));
                            }
                            if (finalstr) {
                                var check = type.charAt(type.length - 1);
                                if (flag === 1) {
                                    res = flag;
                                    flag = flag + 1;
                                } else if (flag > 1) {
                                    res = flag;
                                    flag = flag + 1;
                                }
                                // var str2 = type.charAt(type.length-1);
                                if (check !== "H" && check !== "L" && check !== "M" && check !== "V" && check !== "T") {
                                    oResponse.value[i].serialNo = res;
                                    oResponse.value[i].eW = 0;
                                    //  oResponse.value[i].obwght = 0;
                                    tempArray.push(oResponse.value[i]);
                                    that.getView().byId("si1").setValue(0);
                                    that.getView().byId("cb1").setSelected(false);
                                    if (oResponse.value[i].complexityType === "YN" || oResponse.value[i].complexityType === "Y" || oResponse.value[i].complexityType === "N") {
                                        that.getView().byId("cb1").setVisible(true);
                                        that.getView().byId("si1").setVisible(false);
                                        that.getView().byId("si1").attachChange("onChangeStepInput");
                                    } else {
                                        that.getView().byId("cb1").setVisible(false);
                                        that.getView().byId("si1").setVisible(true);
                                        that.getView().byId("si1").attachChange("onChangeStepInput");
                                    }
                                    oModelTable.setProperty("/attr", tempArray);
                                    that.getView().setModel(oModelTable, "oModelTable");

                                }

                            }
                        }

                    },
                    error: function (oResponse) {
                        that.getView().setBusy(false);
                        //  sap.ui.core.BusyIndicator.hide();
                    }
                });

            },
            onSelectTable: function () {
                var that = this;
                var oModelTableData = this.getView().byId("idProductsTable").getModel("oModelTable").getData().attr;
                var sTable = this.getView().byId("idProductsTable");
                var sSelectD = sTable.getSelectedItems();
                //     var sPath = sSelectD[0].oBindingContexts.oModelTable.sPath;

                var index = this.getView().byId("idProductsTable").getSelectedItems()[0].oBindingContexts.oModelTable.sPath.split('/')[2];
                for (var i = 0; i < oModelTableData.length; i++) {
                    if (i === parseInt(index)) {
                        var cols = sSelectD[0].getCells();
                        cols[2].mAggregations.items[0].setEnabled(true);
                        cols[2].mAggregations.items[1].setEnabled(true);
                        cols[3].setEnabled(true);
                        // cols[2].mAggregations.items[0].setValue();
                        var checkbox = cols[2].mAggregations.items[1].getSelected();
                        if (checkbox === true) {
                            this.onChangeStepInput();
                        }
                    } else {
                        var cols = this.getView().byId("idProductsTable").getItems()[i].getCells();
                        cols[2].mAggregations.items[0].setEnabled(false);
                        cols[2].mAggregations.items[1].setEnabled(false);
                        cols[3].setEnabled(false);
                    }
                }



            },
            onChangeStepInput: function (oEvent) {
                var that = this;
                var oModelTable = this.getView().getModel("oModelTable");
                var oModelTableData = this.getView().byId("idProductsTable").getModel("oModelTable").getData().attr;
                // var stepInputValue = oEvent.getSource().getValue();
                var sTable = this.getView().byId("idProductsTable");
                var oModelCompdet = new sap.ui.model.json.JSONModel({
                    "attr": []
                });
                var temp = [], temparraydet = [];
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var that = this;
                var sUrl = path + "catalog/Criteria";
                var selectedKey = this.getView().byId("idComboBox").getSelectedKey();
                var items = this.getView().byId("idProductsTable").getItems();
                var sSelectD = sTable.getSelectedItems();
                var sSelectedData = sSelectD[0];
                var cols = sSelectedData.getCells();
                var compx = cols[0].getText();
                var totalobtweght = 0;
                var W1, W2, W3, finalcomplexity, finalstr;
                for (var r = 0; r < oModelTableData.length; r++) {
                    if (parseInt(compx) === parseInt(oModelTableData[r].serialNo)) {

                        var stepvalue = cols[2].mAggregations.items[0].getValue();
                        var checkbox = cols[2].mAggregations.items[1].getSelected();
                        if (stepvalue === 0) {
                            oModelTableData[r].obwght = 0;
                        }
                        else if (stepvalue > 0 && stepvalue < 3) {
                            oModelTableData[r].obwght = oModelTableData[r].W1;
                        } else if (stepvalue >= 3 && stepvalue < 7) {
                            oModelTableData[r].obwght = oModelTableData[r].W2;
                        } else if (stepvalue >= 7 && stepvalue < 10) {
                            oModelTableData[r].obwght = oModelTableData[r].W3;
                        } else {
                            oModelTableData[r].obwght = 4;
                        }
                        if (checkbox === true) {
                            oModelTableData[r].obwght = 1;
                        }
                        oModelTable.setProperty("/attr", oModelTableData);
                        that.getView().getModel("oModelTable").refresh();
                    }

                }
                for (var i = 0; i < items.length; i++) {
                    var compid = sTable.getItems()[i].getCells()[5].getText();
                    var obtweght = sTable.getItems()[i].getCells()[4].getText();
                    if (obtweght !== "") {
                        totalobtweght = parseInt(totalobtweght) + parseInt(obtweght);
                    }
                }
                if (compid.substring(0, 1) === selectedKey.substring(0, 1)) {
                    //  sap.ui.core.BusyIndicator.show(0);
                    that.getView().setBusy(true);
                    jQuery.ajax({
                        url: sUrl,
                        method: "GET",
                        async: true,
                        success: function (oResponse) {
                            //   sap.ui.core.BusyIndicator.hide();
                            that.getView().setBusy(false);
                            //oModelTable.setProperty("/attr", oResponse.value);
                            for (var i = 0; i < oResponse.value.length; i++) {
                                var type = oResponse.value[i].complexityID;
                                var str = type.substring(0, 3);
                                if (str.length <= 3) {
                                    finalstr = selectedKey.startsWith(str.substring(0, 2));
                                } else {
                                    finalstr = selectedKey.startsWith(str.substring(0, 3));
                                }
                                if (finalstr) {
                                    var check = type.charAt(type.length - 1);
                                    temparraydet.totalobtweght = totalobtweght;
                                    finalTotalWeight = totalobtweght;
                                    if (check === "H" || check === "L" || check === "M" || check === "V" || check === "T") {
                                        if (check === "T") {
                                            W1 = oResponse.value[i].W1;
                                            W2 = oResponse.value[i].W2;
                                            W3 = oResponse.value[i].W3;
                                            if (totalobtweght <= W1) {
                                                oResponse.value[i].finalcomplexity = "low";
                                            } else if (totalobtweght > W1 && totalobtweght <= W2) {
                                                oResponse.value[i].finalcomplexity = "Medium";
                                            } else if (totalobtweght > W2 && totalobtweght <= W3) {
                                                oResponse.value[i].finalcomplexity = "High"
                                            } else {
                                                oResponse.value[i].finalcomplexity = "Very High";
                                            }
                                            temparraydet.finalcomplexity = oResponse.value[i].finalcomplexity;
                                            Finalcomplexity = oResponse.value[i].finalcomplexity;
                                        }
                                        if (check === "H") {
                                            temparraydet.higheff = oResponse.value[i].W1;
                                        }
                                        if (check === "L") {
                                            temparraydet.loweff = oResponse.value[i].W1;
                                        }
                                        if (check === "M") {
                                            temparraydet.mediumeff = oResponse.value[i].W1;
                                        }
                                        if (check === "V") {
                                            temparraydet.vhigheff = oResponse.value[i].W1;
                                        }
                                        if (temparraydet.finalcomplexity === "low") {
                                            oResponse.value[i].effinhrs = temparraydet.loweff;
                                        } else if (temparraydet.finalcomplexity === "Medium") {
                                            oResponse.value[i].effinhrs = temparraydet.mediumeff;
                                        } else if (temparraydet.finalcomplexity === "High") {
                                            oResponse.value[i].effinhrs = temparraydet.higheff;
                                        } else if (temparraydet.finalcomplexity === "Very High") {
                                            oResponse.value[i].effinhrs = temparraydet.vhigheff;
                                        }
                                        temparraydet.effinhrs = oResponse.value[i].effinhrs;
                                        Effortsinhrs = oResponse.value[i].effinhrs;
                                        temp.push(temparraydet);
                                        oModelCompdet.setProperty("/attr", temp[0]);
                                        that.getView().setModel(oModelCompdet, "oModelCompdet");
                                    }


                                }
                            }

                        },
                        error: function (oResponse) {
                            that.getView().setBusy(false);
                            // sap.ui.core.BusyIndicator.hide();
                        }
                    });
                }


            },
            onPressSaveRecords: function (oEvent) {
                var that = this;
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var items = this.getView().byId("idProductsTable").getItems();
                var oTable = this.getView().byId("idProductsTable");
                var projtid;
                var prjname = this.getView().byId("comboBoxProj").getValue();
                var oModelProjData = this.getView().getModel("oModelProj").getData().attr;
                for (var index = 0; index < oModelProjData.length; index++) {
                    var prj = oModelProjData[index].projectName;
                    if (prjname === prj) {
                        projtid = oModelProjData[index].projectID;
                    }
                }
                var objectid;
                var objectname = this.getView().byId("comboBoxObj").getValue();
                var oModelObjData = this.getView().getModel("oModelObj").getData().attr;
                for (var index = 0; index < oModelObjData.length; index++) {
                    var ObjectID = oModelObjData[index].objectName;
                    if (objectname === ObjectID) {
                        objectid = oModelObjData[index].objectID;
                    }
                }
                var subobjid;
                var subobjname = this.getView().byId("comboBoxSubObj").getValue();
                var oModelSubObjData = this.getView().getModel("oModelSubObj").getData().attr;
                for (var index = 0; index < oModelSubObjData.length; index++) {
                    var subObjectID = oModelSubObjData[index].subObjectType;
                    if (subobjname === subObjectID) {
                        subobjid = oModelSubObjData[index].subObjectID;
                    }
                }
                var selectedKey = this.getView().byId("idComboBox").getSelectedKey();
                var riceftype = this.getView().byId("idSelectType").getSelectedKey();
                var W1, W2, W3;
                var flagsave = 1;
                var postflag;


                //var complexityIDs = oTable.getItems()[0].getCells()[5].getText();

                for (var i = 0; i < items.length; i++) {
                    var complexityID = oTable.getItems()[i].getCells()[5].getText();
                    var compcriteria = oTable.getItems()[i].getCells()[1].getText();
                    var obtainedwtgt = parseInt(oTable.getItems()[i].getCells()[4].getText());
                    var checkbox = oTable.getItems()[i].getCells()[2].mAggregations.items[1].getSelected();
                    var stepvalue = oTable.getItems()[i].getCells()[2].mAggregations.items[0].getValue();
                    var payloadComdet = JSON.stringify({ "projectID": projtid, "objectID": objectid, "subObjectID": subobjid, "complexityID": complexityID, "eW": stepvalue, "oW": obtainedwtgt, "ricefTypes": riceftype, "description": compcriteria, "appType": selectedKey });
                    var sUrl = path + "catalog/RICEF";
                    // sap.ui.core.BusyIndicator.show(0);
                    that.getView().setBusy(true);
                    jQuery.ajax({
                        url: sUrl,
                        method: "POST",
                        data: payloadComdet,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        async: true,
                        success: function (oResponse) {
                            that.getView().setBusy(false);
                            //  sap.ui.core.BusyIndicator.hide();
                            flagsave = 0;
                            /* that.getView().byId("idComboBox").setEnabled(false);
                             that.getView().byId("idRefreshB").setEnabled(false);
                             that.getView().byId("idSaveB").setEnabled(false);
                             var dataModel = that.getView().byId("idProductsTable").getModel("oModelTable");
                             if (dataModel) {
                                 dataModel.setData(null);
                                 dataModel.updateBindings(true);
                             }
                             var dataModelCompdet = that.getView().getModel("oModelCompdet");
                             if (dataModelCompdet) {
                                 dataModelCompdet.setData(null);
                                 dataModelCompdet.updateBindings(true);
                             }*/

                        },
                        error: function (oResponse) {
                            that.getView().setBusy(false);
                            // sap.ui.core.BusyIndicator.hide();
                            // flagsave = flagsave + 1;


                        }
                    });
                }

                var Effortsinhrsstring = Effortsinhrs.toString();
                var payloadComdet = JSON.stringify({ "projectID": projtid, "objectID": objectid, "subObjectID": subobjid, "ricefTypes": riceftype, "complexity": Finalcomplexity, "totalWeight": finalTotalWeight, "effort": Effortsinhrsstring });
                var sUrl = path + "catalog/Complexity";
                //  sap.ui.core.BusyIndicator.show(0);
                that.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    method: "POST",
                    data: payloadComdet,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: true,
                    success: function (oResponse) {
                        that.getView().setBusy(false);
                        // sap.ui.core.BusyIndicator.hide();
                        MessageBox.information("Details saved successfully!");
                    },
                    error: function (oResponse) {
                        that.getView().setBusy(false);
                        //  sap.ui.core.BusyIndicator.hide();
                        MessageBox.error("cannot save details!");

                    }
                });



            },
            onClickInfo: function (oEvent) {
                var oModelTableData = this.getView().getModel("oModelTable").getData().attr;
                var oTable = this.getView().byId("idProductsTable");
                var items = this.getView().byId("idProductsTable").getSelectedItems();
                var array = [];
                var info;
                var oButton = oEvent.getSource();
                // create popover
                if (!this._pPopover) {
                    this._pPopover = sap.ui.xmlfragment("idpopoverDialog", "zsap.ui5.btpestimator.view.Popover", this);
                    this.getView().addDependent(this._pPopover);

                }
                else
                    this.getView().addDependent(this._pPopover);
                for (var j = 0; j < oModelTableData.length; j++) {
                    var desc = items[0].getCells()[1].getText();
                    if (desc === oModelTableData[j].description) {
                        info = oModelTableData[j].information;
                        this._pPopover.getContent()[0].setText(oModelTableData[j].information);
                    }

                }
                this._pPopover.openBy(oButton);

            },
            onClickSummaryReport: function (oEvent) {
                var projtid;
                var prjname = this.getView().byId("comboBoxProj").getValue();
                var oModelProjData = this.getView().getModel("oModelProj").getData().attr;
                for (var index = 0; index < oModelProjData.length; index++) {
                    var prj = oModelProjData[index].projectName;
                    if (prjname === prj) {
                        projtid = oModelProjData[index].projectID;
                    }
                }

                if (this.getView().byId("comboBoxProj").getValue() === '') {
                    MessageBox.information("Please select Project to view the Summary Report");
                }
                else {
                    if (!this.oSumRepDialog) {
                        this.oSumRepDialog = sap.ui.xmlfragment("idSumRepDialog", "zsap.ui5.btpestimator.view.Summary", this);
                        this.getView().addDependent(this.oSumRepDialog);
                    } else {
                        this.getView().addDependent(this.oSumRepDialog);
                    }

                    this.oSumRepDialog.open();
                    sap.ui.core.Fragment.byId("idSumRepDialog", "titletable").setText("Project Name:" + prjname);
                    let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                    var that = this;
                    var sUrl = path + "catalog/Complexity?$filter=projectID eq '" + projtid + "'";
                    var sTable = sap.ui.core.Fragment.byId("idSumRepDialog", "idTableSumRep");
                    var oModelSumRep = sTable.getModel("oModelSumRep");
                    var data = oModelSumRep.getData();

                    var riceftype;
                    that.getView().setBusy(true);
                    //  sap.ui.core.BusyIndicator.show(0);
                    jQuery.ajax({
                        url: sUrl,
                        method: "GET",
                        success: function (oResponse) {
                            that.getView().setBusy(false);
                            // sap.ui.core.BusyIndicator.hide();
                            for (var i = 0; i < oResponse.value.length; i++) {
                                riceftype = oResponse.value[i].ricefTypes;
                                var complexity = oResponse.value[i].complexity;
                                if (riceftype === "Report" && complexity === "low") {

                                    data.Objects[0].R = 1;
                                    data.Objects[0].T = 1;
                                    data.Objects[0].EF = oResponse.value[i].effort;
                                    data.Objects[4].R = data.Objects[0].R;
                                    data.Objects[4].T = data.Objects[0].T;
                                    data.Objects[4].EF = data.Objects[0].EF;

                                } else if (riceftype === "Report" && complexity === "Medium") {

                                    data.Objects[1].R = 1;
                                    data.Objects[1].T = 1;
                                    data.Objects[1].EF = oResponse.value[i].effort;
                                    data.Objects[4].R = data.Objects[1].R;
                                    data.Objects[4].T = data.Objects[0].T;
                                    data.Objects[4].EF = data.Objects[0].EF;

                                } else if (riceftype === "Report" && complexity === "High") {

                                    data.Objects[2].R = 1;
                                    data.Objects[2].T = 1;
                                    data.Objects[2].EF = oResponse.value[i].effort;
                                    data.Objects[4].R = data.Objects[2].R;
                                    data.Objects[4].T = data.Objects[0].T;
                                    data.Objects[4].EF = data.Objects[0].EF;

                                } else if (riceftype === "Report" && complexity === "Very High") {

                                    data.Objects[3].R = 1;
                                    data.Objects[3].T = 1;
                                    data.Objects[3].EF = oResponse.value[i].effort;
                                    data.Objects[4].R = data.Objects[3].R;
                                    data.Objects[4].T = data.Objects[0].T;
                                    data.Objects[4].EF = data.Objects[0].EF;

                                } else if (riceftype === "Interface" && complexity === "low") {

                                    data.Objects[0].I = 1;
                                    data.Objects[0].T = data.Objects[0].I;
                                    data.Objects[0].EF = oResponse.value[i].effort;
                                    data.Objects[4].I = data.Objects[0].I;
                                    data.Objects[4].T = data.Objects[0].T;
                                    data.Objects[4].EF = data.Objects[0].EF;

                                } else if (riceftype === "Interface" && complexity === "Medium") {

                                    data.Objects[1].I = 1;
                                    data.Objects[1].T = data.Objects[1].I;
                                    data.Objects[1].EF = oResponse.value[i].effort;
                                    data.Objects[4].I = data.Objects[1].I;
                                    data.Objects[4].T = data.Objects[1].T;
                                    data.Objects[4].EF = data.Objects[1].EF;

                                } else if (riceftype === "Interface" && complexity === "High") {

                                    data.Objects[2].I = 1;
                                    data.Objects[2].T = data.Objects[2].I;
                                    data.Objects[2].EF = oResponse.value[i].effort;
                                    data.Objects[4].I = data.Objects[2].I;
                                    data.Objects[4].T = data.Objects[2].T;
                                    data.Objects[4].EF = data.Objects[2].EF;

                                } else if (riceftype === "Interface" && complexity === "Very High") {

                                    data.Objects[3].I = 1;
                                    data.Objects[3].T = data.Objects[3].I;
                                    data.Objects[3].EF = oResponse.value[i].effort;
                                    data.Objects[4].I = data.Objects[3].I;
                                    data.Objects[4].T = data.Objects[3].T;
                                    data.Objects[4].EF = data.Objects[3].EF;

                                } else if (riceftype === "Conversions" && complexity === "low") {

                                    data.Objects[0].C = 1;
                                    data.Objects[0].T = data.Objects[0].C;
                                    data.Objects[0].EF = oResponse.value[i].effort;
                                    data.Objects[4].C = data.Objects[0].C;
                                    data.Objects[4].T = data.Objects[0].T;
                                    data.Objects[4].EF = data.Objects[0].EF;

                                } else if (riceftype === "Conversions" && complexity === "Medium") {

                                    data.Objects[1].C = 1;
                                    data.Objects[1].T = data.Objects[1].C;
                                    data.Objects[1].EF = oResponse.value[i].effort;
                                    data.Objects[4].C = data.Objects[1].C;
                                    data.Objects[4].T = data.Objects[1].T;
                                    data.Objects[4].EF = data.Objects[1].EF;

                                } else if (riceftype === "Conversions" && complexity === "High") {

                                    data.Objects[2].C = 1;
                                    data.Objects[2].T = data.Objects[2].C;
                                    data.Objects[2].EF = oResponse.value[i].effort;
                                    data.Objects[4].C = data.Objects[2].C;
                                    data.Objects[4].T = data.Objects[2].T;
                                    data.Objects[4].EF = data.Objects[2].EF;

                                } else if (riceftype === "Conversions" && complexity === "Very High") {

                                    data.Objects[3].C = 1;
                                    data.Objects[3].T = data.Objects[3].C;
                                    data.Objects[3].EF = oResponse.value[i].effort;
                                    data.Objects[4].C = data.Objects[3].C;
                                    data.Objects[4].T = data.Objects[3].T;
                                    data.Objects[4].EF = data.Objects[3].EF;

                                } else if (riceftype === "Enhancements" && complexity === "low") {

                                    data.Objects[0].E = 1;
                                    data.Objects[0].T = data.Objects[0].E;
                                    data.Objects[0].EF = oResponse.value[i].effort;
                                    data.Objects[4].E = data.Objects[0].E;
                                    data.Objects[4].T = data.Objects[0].T;
                                    data.Objects[4].EF = data.Objects[0].EF;

                                } else if (riceftype === "Enhancements" && complexity === "Medium") {

                                    data.Objects[1].E = 1;
                                    data.Objects[1].T = data.Objects[1].E;
                                    data.Objects[1].EF = oResponse.value[i].effort;
                                    data.Objects[4].E = data.Objects[1].E;
                                    data.Objects[4].T = data.Objects[1].T;
                                    data.Objects[4].EF = data.Objects[1].EF;

                                } else if (riceftype === "Enhancements" && complexity === "High") {

                                    data.Objects[2].E = 1;
                                    data.Objects[2].T = data.Objects[2].E;
                                    data.Objects[2].EF = oResponse.value[i].effort;
                                    data.Objects[4].E = data.Objects[2].E;
                                    data.Objects[4].T = data.Objects[2].T;
                                    data.Objects[4].EF = data.Objects[2].EF;

                                } else if (riceftype === "Enhancements" && complexity === "Very High") {

                                    data.Objects[3].E = 1;
                                    data.Objects[3].T = data.Objects[3].E;
                                    data.Objects[3].EF = oResponse.value[i].effort;
                                    data.Objects[4].E = data.Objects[3].E;
                                    data.Objects[4].T = data.Objects[3].T;
                                    data.Objects[4].EF = data.Objects[0].EF;

                                } else if (riceftype === "Forms" && complexity === "low") {

                                    data.Objects[0].F = 1;
                                    data.Objects[0].T = data.Objects[0].F;
                                    data.Objects[0].EF = oResponse.value[i].effort;
                                    data.Objects[4].F = data.Objects[0].F;
                                    data.Objects[4].T = data.Objects[0].T;
                                    data.Objects[4].EF = data.Objects[0].EF;

                                } else if (riceftype === "Forms" && complexity === "Medium") {

                                    data.Objects[1].F = 1;
                                    data.Objects[1].T = data.Objects[1].F;
                                    data.Objects[1].EF = oResponse.value[i].effort;
                                    data.Objects[4].F = data.Objects[1].F;
                                    data.Objects[4].T = data.Objects[1].T;
                                    data.Objects[4].EF = data.Objects[1].EF;

                                } else if (riceftype === "Forms" && complexity === "High") {

                                    data.Objects[2].F = 1;
                                    data.Objects[2].T = data.Objects[2].F;
                                    data.Objects[2].EF = oResponse.value[i].effort;
                                    data.Objects[4].F = data.Objects[2].F;
                                    data.Objects[4].T = data.Objects[2].T;
                                    data.Objects[4].EF = data.Objects[2].EF;

                                } else if (riceftype === "Forms" && complexity === "Very High") {

                                    data.Objects[3].F = 1;
                                    data.Objects[3].T = data.Objects[3].F;
                                    data.Objects[3].EF = oResponse.value[i].effort;
                                    data.Objects[4].F = data.Objects[3].F;
                                    data.Objects[4].T = data.Objects[3].T;
                                    data.Objects[4].EF = data.Objects[3].EF;

                                } else if (riceftype === "Workflows" && complexity === "low") {

                                    data.Objects[0].W = 1;
                                    data.Objects[0].T = data.Objects[0].W;
                                    data.Objects[0].EF = oResponse.value[i].effort;
                                    data.Objects[4].W = data.Objects[0].W;
                                    data.Objects[4].T = data.Objects[0].T;
                                    data.Objects[4].EF = data.Objects[0].EF;

                                } else if (riceftype === "Workflows" && complexity === "Medium") {

                                    data.Objects[1].W = 1;
                                    data.Objects[1].T = data.Objects[1].W;
                                    data.Objects[1].EF = oResponse.value[i].effort;
                                    data.Objects[4].W = data.Objects[1].W;
                                    data.Objects[4].T = data.Objects[1].T;
                                    data.Objects[4].EF = data.Objects[1].EF;

                                } else if (riceftype === "Workflows" && complexity === "High") {

                                    data.Objects[2].W = 1;
                                    data.Objects[2].T = data.Objects[2].W;
                                    data.Objects[2].EF = oResponse.value[i].effort;
                                    data.Objects[4].W = data.Objects[2].W;
                                    data.Objects[4].T = data.Objects[2].T;
                                    data.Objects[4].EF = data.Objects[2].EF;

                                } else if (riceftype === "Workflows" && complexity === "Very High") {

                                    data.Objects[3].W = 1;
                                    data.Objects[3].T = data.Objects[3].W;
                                    data.Objects[3].EF = oResponse.value[i].effort;
                                    data.Objects[4].W = data.Objects[3].W;
                                    data.Objects[4].T = data.Objects[3].T;
                                    data.Objects[4].EF = data.Objects[3].EF;

                                }
                                data.Objects[0].T = data.Objects[0].R + data.Objects[0].I + data.Objects[0].C + data.Objects[0].E + data.Objects[0].F + data.Objects[0].W;
                                data.Objects[1].T = data.Objects[1].R + data.Objects[1].I + data.Objects[1].C + data.Objects[1].E + data.Objects[1].F + data.Objects[1].W;
                                data.Objects[2].T = data.Objects[2].R + data.Objects[2].I + data.Objects[2].C + data.Objects[2].E + data.Objects[2].F + data.Objects[2].W;
                                data.Objects[3].T = data.Objects[3].R + data.Objects[3].I + data.Objects[3].C + data.Objects[3].E + data.Objects[3].F + data.Objects[3].W;
                                data.Objects[4].R = data.Objects[0].R + data.Objects[1].R + data.Objects[2].R + data.Objects[3].R;
                                data.Objects[4].I = data.Objects[0].I + data.Objects[1].I + data.Objects[2].I + data.Objects[3].I;
                                data.Objects[4].C = data.Objects[0].C + data.Objects[1].C + data.Objects[2].C + data.Objects[3].C;
                                data.Objects[4].E = data.Objects[0].E + data.Objects[1].E + data.Objects[2].E + data.Objects[3].E;
                                data.Objects[4].F = data.Objects[0].F + data.Objects[1].F + data.Objects[2].F + data.Objects[3].F;
                                data.Objects[4].W = data.Objects[0].W + data.Objects[1].W + data.Objects[2].W + data.Objects[3].W;
                                data.Objects[4].T = data.Objects[0].T + data.Objects[1].T + data.Objects[2].T + data.Objects[3].T;
                                data.Objects[4].EF = parseInt(data.Objects[0].EF) + parseInt(data.Objects[1].EF) + parseInt(data.Objects[2].EF) + parseInt(data.Objects[3].EF);
                                oModelSumRep.setData(data);
                                that.getView().getModel("oModelSumRep").refresh();

                            }
                        },
                        error: function (oResponse) {
                            that.getView().setBusy(false);
                            //sap.ui.core.BusyIndicator.hide();
                        }
                    });

                }
            },
            onPressCloseSumRep: function () {
                this.oSumRepDialog.close();
            },

            onDataExport: function () {
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = sap.ui.core.Fragment.byId("idSumRepDialog", "idTableSumRep");
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'SummaryReport.xlsx',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });


            },
            createColumnConfig: function () {
                var aCols = [];

                aCols.push({
                    label: 'Complexity',
                    property: 'Complexity',
                    type: EdmType.String,

                });

                aCols.push({
                    label: 'Report',
                    type: EdmType.Number,
                    property: 'R',
                    scale: 0
                });
                aCols.push({
                    label: 'Interface',
                    type: EdmType.Number,
                    property: 'I',
                    scale: 0
                });
                aCols.push({
                    label: 'Conversion',
                    type: EdmType.Number,
                    property: 'C',
                    scale: 0
                });
                aCols.push({
                    label: 'Enhancement',
                    type: EdmType.Number,
                    property: 'E',
                    scale: 0
                });
                aCols.push({
                    label: 'Form',
                    type: EdmType.Number,
                    property: 'F',
                    scale: 0
                });
                aCols.push({
                    label: 'Workflow',
                    type: EdmType.Number,
                    property: 'R',
                    scale: 0
                });

                aCols.push({
                    label: 'Total Objects',
                    type: EdmType.Number,
                    property: 'T',
                    scale: 0
                });

                aCols.push({
                    label: 'Total Efforts(.hrs)',
                    type: EdmType.Number,
                    property: 'EF',
                    scale: 0
                });



                return aCols;
            },

            onClickDetailReport: function (oEvent) {
                var prjtid;
                var prjname = this.getView().byId("comboBoxProj").getValue();
                var oModelProjData = this.getView().getModel("oModelProj").getData().attr;
                for (var index = 0; index < oModelProjData.length; index++) {
                    var prj = oModelProjData[index].projectName;
                    if (prjname === prj) {
                        prjtid = oModelProjData[index].projectID;
                    }
                }
                if (this.getView().byId("comboBoxProj").getValue() === '') {
                    MessageBox.information("Please select Project to view the Detail Report");
                } else {
                    let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                    var that = this;
                    var sUrl = path + "catalog/SubObjects?$filter=projectID eq '" + prjtid + "'";
                    //sap.ui.core.BusyIndicator.show(0);
                    this.getView().setBusy(true);
                    jQuery.ajax({
                        url: sUrl,
                        headers: { "Content-Type": "application/json" },
                        method: "GET",
                        async: false,
                        success: function (oResponse) {

                            // sap.ui.core.BusyIndicator.hide();
                            that.getView().setBusy(false);
                            oModelSubObjDataG.setData(oResponse.value);
                            that.OpenDialog();
                            // that.getView().setModel(oModelSubObj, "oModelSubObj");
                        },
                        error: function (oResponse) {
                            //sap.ui.core.BusyIndicator.hide();
                            that.getView().setBusy(false);
                            that.OpenDialog();
                        }
                    });
                }
            },
            OpenDialog: function () {
                var prjtid;
                var prjname = this.getView().byId("comboBoxProj").getValue();
                var oModelProjData = this.getView().getModel("oModelProj").getData().attr;
                for (var index = 0; index < oModelProjData.length; index++) {
                    var prj = oModelProjData[index].projectName;
                    if (prjname === prj) {
                        prjtid = oModelProjData[index].projectID;
                    }
                }
                if (!this.oDetRepDialog) {
                    this.oDetRepDialog = sap.ui.xmlfragment("idDetRepDialog", "zsap.ui5.btpestimator.view.Detail", this);
                    this.getView().addDependent(this.oDetRepDialog);
                } else {
                    this.getView().addDependent(this.oDetRepDialog);
                }
                this.oDetRepDialog.open();
                var oModelObjData = this.getView().getModel("oModelObj").getData().attr;
                sap.ui.core.Fragment.byId("idDetRepDialog", "titletable").setText("Project Name:" + prjname);
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var that = this;
                var sUrl = path + "catalog/Complexity?$filter=projectID eq '" + prjtid + "'";
                var oModelDetRep = new sap.ui.model.json.JSONModel({
                    "attr": []
                });

                var oModelSubObjData = oModelSubObjDataG;
                var totalefforts = 0;

                sap.ui.core.BusyIndicator.show(0);
                jQuery.ajax({
                    url: sUrl,
                    method: "GET",
                    success: function (oResponse) {
                        sap.ui.core.BusyIndicator.hide();
                        for (var i = 0; i < oResponse.value.length; i++) {
                            for (var j = 0; j < oModelProjData.length; j++) {
                                var projectid = oModelProjData[j].projectID;
                                if (projectid === oResponse.value[i].projectID) {
                                    oResponse.value[i].projectName = oModelProjData[j].projectName;
                                }
                            }
                            for (var k = 0; k < oModelObjData.length; k++) {
                                var objectid = oModelObjData[k].objectID;
                                if (objectid === oResponse.value[i].objectID) {
                                    oResponse.value[i].objectName = oModelObjData[k].objectName;
                                    totalefforts = totalefforts + parseInt(oResponse.value[i].effort);
                                }
                            }
                            for (var index = 0; index < oModelSubObjData.oData.length; index++) {
                                var subObjectID = oModelSubObjData.oData[index].subObjectID;
                                if (subObjectID === oResponse.value[i].subObjectID) {
                                    oResponse.value[i].subObj = oModelSubObjData.oData[index].subObjectType;
                                }
                            }


                            oResponse.value[i].totalefforts = totalefforts;
                        }
                        //  sap.ui.core.Fragment.byId("idDetRepDialog", "foottxt2").setText(totalefforts);
                        oModelDetRep.setProperty("/attr", oResponse.value);
                        that.getView().setModel(oModelDetRep, "oModelDetRep");
                        that.CalculateTotaleff();
                    },
                    error: function (oResponse) {

                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            },
            CalculateTotaleff: function () {
                var subTotal = {};
                var oModelDetRepData = this.getView().getModel("oModelDetRep").getData();
                for (const { objectID, effort } of oModelDetRepData.attr) {
                    subTotal[objectID] ??= 0;
                    subTotal[objectID] += parseInt(effort);
                }
                var tempArray = [];
                for (var i = 0; i < oModelDetRepData.attr.length; i++) {
                    let newEntry = {
                        "complexity": "",
                        "effort": "",
                        "objectID": "",
                        "objectName": "",
                        "projectID": "",
                        "projectName": "",
                        "ricefTypes": "",
                        "subObj": "",
                        "subObjectID": "",
                        "totalWeight": "",
                        "totalefforts": ""
                    };
                    tempArray.push(oModelDetRepData.attr[i]);
                    if (i === (oModelDetRepData.attr.length - 1)) {

                        newEntry.complexity = "Sub Total";
                        newEntry.effort = subTotal[oModelDetRepData.attr[i].objectID];
                        tempArray.splice((tempArray.length), 0, newEntry);
                    }
                    else if ((i + 1) !== oModelDetRepData.attr.length && oModelDetRepData.attr[i].objectID !== oModelDetRepData.attr[i + 1].objectID) {
                        newEntry.complexity = "Sub Total";
                        newEntry.effort = subTotal[oModelDetRepData.attr[i].objectID];
                        tempArray.splice((tempArray.length), 0, newEntry);
                    }

                }
                oModelDetRepData.attr = tempArray;
                this.getView().getModel("oModelDetRep").setData(oModelDetRepData);
                this.getView().getModel("oModelDetRep").refresh();

            },
            onPressCloseDetRep: function () {
                this.oDetRepDialog.close();
            },
            onDataExportDet: function () {
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = sap.ui.core.Fragment.byId("idDetRepDialog", "idTableDetRep");
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfigDet();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'DetailReport.xlsx',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            createColumnConfigDet: function () {
                var aCols = [];

                aCols.push({
                    label: 'Project Name',
                    property: 'projectName',
                    type: EdmType.String,

                });

                aCols.push({
                    label: 'Object Name',
                    type: EdmType.Number,
                    property: 'objectName',
                    scale: 0
                });
                aCols.push({
                    label: 'RICEFW Type',
                    type: EdmType.Number,
                    property: 'ricefTypes',
                    scale: 0
                });
                aCols.push({
                    label: 'Sub Object Name',
                    type: EdmType.Number,
                    property: 'subObj',
                    scale: 0
                });
                aCols.push({
                    label: 'Complexity',
                    type: EdmType.Number,
                    property: 'complexity',
                    scale: 0
                });
                aCols.push({
                    label: 'Efforts',
                    type: EdmType.Number,
                    property: 'effort',
                    scale: 0
                });

                return aCols;
            },

            onPressDeletePrj: function () {
                var that = this;
                var val = this.getView().byId("comboBoxProj").getValue();
                var comboBoxProj = this.getView().byId("comboBoxProj").getSelectedKey();
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var that = this;
                var sUrl = path + "catalog/Projects/" + comboBoxProj;
                this.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    headers: { "Content-Type": "application/json" },
                    method: "DELETE",
                    success: function (oResponse) {
                        that.getView().setBusy(false);
                        that.onBeforeRendering();
                        // that.onSelectProjectType();
                        MessageBox.information("Project  '" + val + " ' Deleted Successfully!!!");
                        that.getView().byId("comboBoxProj").setSelectedKey("");
                        that.getView().byId("comboBoxObj").setValue("");
                        that.getView().byId("comboBoxSubObj").setValue("");
                        that.getView().getModel("oModelProj").refresh();
                        that.getView().getModel("oModelObj").refresh();
                        that.getView().getModel("oModelSubObj").refresh();
                    },
                    error: function (oResponse) {
                        // sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        if (oResponse.responseJSON.error.message !== "")
                            MessageBox.error(oResponse.responseJSON.error.message);
                        else
                            MessageBox.error("Cannot Delete Project!!");
                    }
                });

                // var table = this.getView().byId("idProductsTable");
                // var selectD = table.getSelectedItems();

                /*    for (var r = 0; r < selectD.length; r++) {
                        var selectedData = selectD[r];
                        var i = selectedData.getCells();
                        var motid = i[0].getValue();
                        var oDataModel = this.getView().getModel("ODataModelMot");
                        sap.ui.core.BusyIndicator.show();
                        oDataModel.remove("/ZIV_BO_SD_MOT(MotId='" + motid + "')", {

                            success: function (t, a) {
                                sap.ui.core.BusyIndicator.hide();
                                that.FlagDelete = that.FlagDelete + 1;
                                that.getView().byId("idStableMot").getModel().refresh(true);
                            },
                            error: function (t, a) {
                                sap.ui.core.BusyIndicator.hide();
                                that.FlagDelete = 0;
                                that.getView().byId("idStableMot").getModel().refresh(true);
                            }
                        });
                    }
                    this.getView().byId("idSaveMot").setVisible(false);
                    this.getView().byId("idCancelMot").setVisible(false);
                    this.getView().byId("idEditMot").setVisible(true);
                    this.getView().byId("idDeleteMot").setVisible(true);
                    if (that.FlagDelete === 0) {
                        sap.m.MessageBox.error("Cannot Delete Record(s)!");
                        that.FlagDelete = 0;
                    } else {
                        sap.m.MessageBox.information("Record(s) Deleted Successfully!!");
                        that.FlagDelete = 0;
                    } */



            },
            onPressDeleteObj: function () {
                var that = this;
                var val = this.getView().byId("comboBoxObj").getValue();
                var comboBoxProj = this.getView().byId("comboBoxObj").getSelectedKey();
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var that = this;
                var sUrl = path + "catalog/Objects/" + comboBoxProj;
                this.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    headers: { "Content-Type": "application/json" },
                    method: "DELETE",
                    success: function (oResponse) {
                        that.getView().setBusy(false);
                        that.onSelectProjectType();
                        // that.onSelectProjectType();
                        MessageBox.information("Object  '" + val + " ' Deleted Successfully!!!");
                        //    that.getView().byId("comboBoxProj").setSelectedKey("");
                        that.getView().byId("comboBoxObj").setValue("");
                        that.getView().byId("comboBoxSubObj").setValue("");
                        that.getView().getModel("oModelProj").refresh();
                        that.getView().getModel("oModelObj").refresh();
                        that.getView().getModel("oModelSubObj").refresh();
                    },
                    error: function (oResponse) {
                        // sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        if (oResponse.responseJSON.error.message !== "")
                            MessageBox.error(oResponse.responseJSON.error.message);
                        else
                            MessageBox.error("Cannot Delete Object!!");
                    }
                });
            },
            onPressDeleteSubObj: function () {
                var that = this;
                var val = this.getView().byId("comboBoxSubObj").getValue();
                var comboBoxProj = this.getView().byId("comboBoxSubObj").getSelectedKey();
                let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
                var that = this;
                var sUrl = path + "catalog/SubObjects/" + comboBoxProj;
                this.getView().setBusy(true);
                jQuery.ajax({
                    url: sUrl,
                    headers: { "Content-Type": "application/json" },
                    method: "DELETE",
                    success: function (oResponse) {
                        that.getView().setBusy(false);
                        that.onSelectProjectType();
                        // that.onSelectProjectType();
                        MessageBox.information("Sub Object  '" + val + " ' Deleted Successfully!!!");
                        //    that.getView().byId("comboBoxProj").setSelectedKey("");
                      //  that.getView().byId("comboBoxObj").setValue("");
                        that.getView().byId("comboBoxSubObj").setValue("");
                        that.getView().getModel("oModelProj").refresh();
                        that.getView().getModel("oModelObj").refresh();
                        that.getView().getModel("oModelSubObj").refresh();
                        var dataModelsumRep = that.getView().getModel("oModelSumRep");
                        if (dataModelsumRep) {
                            dataModelsumRep.setData(oData);
                            dataModelsumRep.updateBindings(true);
                        }
                        var dataModeldet = that.getView().getModel("oModelDetRep");
                        if (dataModeldet) {
                            dataModeldet.setData(null);
                            dataModeldet.updateBindings(true);
                        }
                    },
                    error: function (oResponse) {
                        // sap.ui.core.BusyIndicator.hide();
                        that.getView().setBusy(false);
                        if (oResponse.responseJSON.error.message !== "")
                            MessageBox.error(oResponse.responseJSON.error.message);
                        else
                            MessageBox.error("Cannot Delete SubObject!!");
                    }
                });
            },


        });
    });
