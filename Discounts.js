import React, { Component } from 'react';
import { Page, Layout, Card, TextField, RadioButton, FormLayout, Stack, Checkbox, Tag, Select } from '@shopify/polaris';

class Discounts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customerType: "all",
            customerTags: [],
            customerExceptLogin: false,
            customerExceptTags: false,
            customerExceptedTags: [],
            tempExeptTagValue: "",
            tempCustomerTagValue: "",
            totalSpendCondition: "gt",
            totalSpendValue: ""

        };
    }

    handleExceptedTags(v){
        if(v && v.trim() !== ""){
            if(v.indexOf(",") > -1){
                var customerExceptedTags = this.state.customerExceptedTags;
                try{
                    v = v.replace(",", "");
                }catch(e){}
                try{
                    if(-1===customerExceptedTags.findIndex(x=>x.trim().toLowerCase() === v.trim().toLowerCase())){
                        customerExceptedTags.push(v.trim());
                    }
                }catch(e){}
                this.setState({customerExceptedTags, tempExeptTagValue: "" });
            }
            else{
                this.setState({tempExeptTagValue: v});
            }
        }
        else{
            this.setState({tempExeptTagValue: v});
        }
    }

    renderExceptedTags(){
        return this.state.customerExceptedTags.map((tag,i) => {
            return <Tag key="{i}" onRemove={() => {
                var customerExceptedTags = this.state.customerExceptedTags;
                customerExceptedTags.splice(i,1);
                this.setState({customerExceptedTags})
            }}>{tag}</Tag>
        })
    }

    handleCustomerTags(v){
        if(v && v.trim() !== ""){
            if(v.indexOf(",") > -1){
                var customerTags = this.state.customerTags;
                try{
                    v = v.replace(",", "");
                }catch(e){}
                try{
                    if(-1===customerTags.findIndex(x=>x.trim().toLowerCase() === v.trim().toLowerCase())){
                        customerTags.push(v.trim());
                    }
                }catch(e){}
                this.setState({customerTags, tempCustomerTagValue: "" });
            }
            else{
                this.setState({tempCustomerTagValue: v});
            }
        }
        else{
            this.setState({tempCustomerTagValue: v});
        }
    }

    renderCustomersTags(){
        return this.state.customerTags.map((tag,i) => {
            return <Tag key="{i}" onRemove={() => {
                var customerTags = this.state.customerTags;
                customerTags.splice(i,1);
                this.setState({customerTags})
            }}>{tag}</Tag>
        })
    }


    render() {
        const {
            customerType, customerExceptLogin, customerExceptTags, customerExceptedTags, tempExeptTagValue, tempCustomerTagValue, returingCondition, totalSpendValue
        } = this.state;

        var customerSubSection = <div className="customers--subSection">
            <Stack vertical spacing="extraTight">
                {
                    ("all" === customerType) && <Checkbox
                        label="Except logged in"
                        checked={customerExceptLogin}
                        onChange={(v) => this.setState({customerExceptLogin:v}) }
                    />
                }
                <Checkbox
                    label="Except customer tags"
                    checked={customerExceptTags}
                    onChange={(v) => this.setState({customerExceptTags:v}) }
                />
                {
                    customerExceptTags && <div>
                        <TextField
                            label="Excepted tag"
                            value={tempExeptTagValue}
                            onChange={ (v) => this.handleExceptedTags(v) }
                            onBlur={() => {
                                var customerExceptedTags = this.state.customerExceptedTags;
                                try{
                                    tempExeptTagValue = tempExeptTagValue.replace(",", "");
                                }catch(e){}
                                try{
                                    if(-1===customerExceptedTags.findIndex(x=>x.trim().toLowerCase() === customerExceptedTags.trim().toLowerCase())){
                                        customerExceptedTags.push(tempExeptTagValue.trim());
                                    }
                                }catch(e){}
                                this.setState({customerExceptedTags, tempExeptTagValue: "" });
                            }}
                        />
                    </div>
                }
                {
                    (customerExceptedTags.length > 0 && customerExceptTags) && <div>
                        <Stack>
                            {this.renderExceptedTags()}
                        </Stack>
                    </div>
                }
            </Stack>
        </div>

        var getTagSection = <div className="customers--subSection">
            <Stack vertical spacing="extraTight">
                <TextField
                    label="Customer tags"
                    value={tempCustomerTagValue}
                    onChange={ (v) => this.handleCustomerTags(v) }
                />
                {
                    (customerType.length > 0) && <div>
                        <Stack>
                            {this.renderCustomersTags()}
                        </Stack>
                    </div>
                }
            </Stack>
        </div>

        var sectionOne = <div>
            <Card title="Customer selection">
                <Card.Section>
                    <FormLayout>
                        <Stack vertical spacing="tight">
                            <RadioButton
                                label="All customers"
                                checked={"all" === customerType}
                                onChange={(v) => this.setState({customerType:"all"}) }
                            />
                            {
                                ("all" === customerType) && customerSubSection
                            }
                            <RadioButton
                                label="Logged in customers"
                                checked={"login" === customerType}
                                onChange={(v) => this.setState({customerType:"login"}) }
                            />
                            {
                                ("login" === customerType) && customerSubSection
                            }
                            <RadioButton
                                label="Specific tag based customers"
                                checked={"tag" === customerType}
                                onChange={(v) => this.setState({customerType:"tag"}) }
                            />
                            {
                                ("tag" === customerType) && getTagSection
                            }
                            <RadioButton
                                label="Returning customers"
                                checked={"returning" === customerType}
                                onChange={(v) => this.setState({customerType:"returning"}) }
                            />
                            {
                                ("returning" === customerType) && <div className="customers--subSection">
                                    <Stack vertical spacing="extraTight">
                                        <TextField
                                            connectedLeft={
                                                <Select
                                                    label="returing customer condition"
                                                    labelHidden
                                                    options={[
                                                        { label:"Total spend greater than", value: "gt" },
                                                        { label:"Total spend less than", value: "lt" },
                                                        { label:"Total spend equal to", value: "eq" }
                                                    ]}
                                                    value={returingCondition}
                                                    onChange={(v)=> {this.setState({returingCondition:v})}}
                                                ></Select>
                                            }
                                            label="Returning customer condition"
                                            labelHidden
                                            value={totalSpendValue}
                                            onChange={(v) => {this.setState({totalSpendValue:v})}}
                                            onBlur={() => {
                                                var totalSpendValue = this.state.totalSpendValue;
                                                if(totalSpendValue){
                                                    if(totalSpendValue.trim() !== ""){
                                                        try{
                                                            totalSpendValue = (Number(totalSpendValue).toFixed(2)).toString();
                                                        }catch(e){}
                                                        if(isNaN(totalSpendValue)){
                                                            totalSpendValue = 0;
                                                        }
                                                        this.setState({totalSpendValue})
                                                    }
                                                }
                                            }}
                                        />
                                    </Stack>
                                </div>
                            }
                        </Stack>
                    </FormLayout>
                </Card.Section>
            </Card>
        </div>

        return (
            <Page
                title="GA"
            >
                <Layout>
                    <Layout.Section>
                        {sectionOne}
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }
}

export default Discounts;
