import React, { Component } from 'react';
import { Page, Layout, Card, TextField, RadioButton, FormLayout, Stack, Checkbox, Tag, Select, PageActions } from '@shopify/polaris';

export default class Discounts extends Component {

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
            totalSpendValue: "",
            discountType: "percentage",
            discountValue: "0",
            appliesTo: "entire_store"
        };
    }

    handleExceptedTags(v){
        if(v && v.trim() !== ""){
            if(v.indexOf(",") > -1){
                var customerExceptedTags = this.state.customerExceptedTags;
                try{
                    v = v.replace(",", "");
                }catch(e){}
                if(v.trim() === "") return;
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
                if(v.trim() === "") return;
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
            customerType, customerExceptLogin, customerExceptTags, customerExceptedTags, tempExeptTagValue, tempCustomerTagValue, returingCondition, totalSpendValue, discountType, discountValue, appliesTo
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
                        <FormLayout>
                            <FormLayout.Group>
                                <TextField
                                    label="Excepted tag"
                                    value={tempExeptTagValue}
                                    onChange={ (v) => this.handleExceptedTags(v) }
                                    onBlur={() => {
                                        var customerExceptedTags = this.state.customerExceptedTags;
                                        var v = this.state.tempExeptTagValue;
                                        try{
                                            v = v.replace(",", "");
                                        }catch(e){}
                                        if(v.trim() === "") return;
                                        try{
                                            if(-1===customerExceptedTags.findIndex(x=>x.trim().toLowerCase() === v.trim().toLowerCase())){
                                                customerExceptedTags.push(v.trim());
                                                this.setState({customerExceptedTags, tempExeptTagValue: "" });
                                            }
                                        }catch(e){}
                                    }}
                                />
                                <div></div>
                                <div></div>
                            </FormLayout.Group>
                        </FormLayout>
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
                <FormLayout>
                    <FormLayout.Group>
                        <TextField
                            label="Customer tags"
                            value={tempCustomerTagValue}
                            onChange={ (v) => this.handleCustomerTags(v) }
                            onBlur={() => {
                                var customerTags = this.state.customerTags;
                                var v = this.state.tempCustomerTagValue;
                                try{
                                    v = v.replace(",", "");
                                }catch(e){}
                                if(v.trim() === "") return;
                                try{
                                    if(-1===customerTags.findIndex(x=>x.trim().toLowerCase() === v.trim().toLowerCase())){
                                        customerTags.push(v.trim());
                                        this.setState({customerTags, tempCustomerTagValue: "" });
                                    }
                                }catch(e){}
                            }}
                        />
                        <div></div><div></div>
                    </FormLayout.Group>
                </FormLayout>
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
                                    <FormLayout>
                                        <FormLayout.Group>
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
                                            <div></div>
                                        </FormLayout.Group>
                                    </FormLayout>
                                </div>
                            }
                        </Stack>
                    </FormLayout>
                </Card.Section>
            </Card>
        </div>

        var sectionTwo = <div>
            <Card title="Discount Types">
                <Card.Section>
                    <FormLayout>
                        <Stack vertical spacing="tight">
                            <RadioButton
                                label="Percentage"
                                value={discountType}
                                checked={"percentage" === discountType}
                                id="percentage"
                                onChange={(v,id) => this.setState({discountType:id})}
                            />
                            <RadioButton
                                label="Price discount (price off)"
                                value={discountType}
                                checked={"price_off" === discountType}
                                id="price_off"
                                onChange={(v,id) => this.setState({discountType:id})}
                            />
                            <RadioButton
                                label="Set fix price"
                                value={discountType}
                                checked={"set_fix_price" === discountType}
                                id="set_fix_price"
                                onChange={(v,id) => this.setState({discountType:id})}
                            />
                        </Stack>
                    </FormLayout>
                </Card.Section>
            </Card>
            <Card title="Value">
                <Card.Section>
                    <FormLayout>
                        <FormLayout.Group>
                            <TextField 
                                label="Discount value"
                                value={discountValue}
                                onChange={(v) => { this.setState({discountValue:v})}}
                                onBlur={()=> {
                                    var discountValue = this.state.discountValue;
                                    if(discountValue && discountValue.trim() !== ""){
                                        try{
                                            discountValue = (Number(discountValue).toFixed(2)).toString();
                                        }catch(e){}
                                        if(isNaN(discountValue))return;
                                        this.setState({discountValue})
                                    }
                                }}
                            />
                            <div></div>
                            <div></div>
                        </FormLayout.Group>
                    </FormLayout>
                </Card.Section>
                <Card.Section title="APPLIES TO">
                    <FormLayout>
                        <Stack vertical spacing="tight">
                            <RadioButton
                                label="Entire order"
                                checked={"entire_store" === appliesTo}
                                id="entire_store"
                                onChange={(v,id) => this.setState({appliesTo:id})}
                            />
                            <RadioButton
                                label="Specific collections"
                                checked={"collections" === appliesTo}
                                id="collections"
                                onChange={(v,id) => this.setState({appliesTo:id})}
                            />
                            <RadioButton
                                label="Specific products"
                                checked={"products" === appliesTo}
                                id="products"
                                onChange={(v,id) => this.setState({appliesTo:id})}
                            />
                            <RadioButton
                                label="Specific variants"
                                checked={"variants" === appliesTo}
                                id="variants"
                                onChange={(v,id) => this.setState({appliesTo:id})}
                            />
                        </Stack>
                    </FormLayout>
                </Card.Section>
            </Card>
        </div>

        return (
            <Page
                title="Discounts"
            >
                <Layout>
                    <Layout.Section>
                        {sectionOne}
                    </Layout.Section>
                    <Layout.Section>
                        {sectionTwo}
                    </Layout.Section>
                    <Layout.Section>
                        <PageActions
                            primaryAction={{content:"Save discount"}}
                            secondaryActions={{content: "Cancel"}}
                        >
                        </PageActions>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }
}
