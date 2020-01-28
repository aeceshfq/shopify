import React, { Component } from 'react';
import { Page, Layout, Card, TextField, RadioButton, FormLayout, Stack, Checkbox, Tag, Select, PageActions, ActionList, Popover, TextStyle, Badge, List, Banner } from '@shopify/polaris';
import { CirclePlusMinor } from '@shopify/polaris-icons';

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
            discountValue: "10.00",
            appliesTo: "entire_store",
            title: "",
            state: "Active",
            exampleProductPrice: "50.00",
            exampleProductQty: "1",
            exampleDiscountType: "percentage",
            exampleDiscountValue: "10.00",
        };
    }

    handleExceptedTags(v){
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
        var customerTags = this.state.customerTags;
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

    exampleResults(){
        var price = Number(this.state.exampleProductPrice);
        var qty = Number(this.state.exampleProductQty);
        var value = Number(this.state.exampleDiscountValue);
        var type = this.state.exampleDiscountType;
        var discount = 0;
        switch (type) {
            case "percentage":
                discount = ((price * qty) * value) / 100;
                break;
            case "set_fix_price":
                discount = (price*qty) - ((price * qty) - value);
                break;
            case "price_off":
                discount = (price * qty) - value;
                break;
            default:
                break;
        }
        var conflict = false;
        if(type === "set_fix_price"){
            if(price < value){discount = price;conflict=true;};
        }
        else if(type === "price_off"){
            if(price < value){discount = price;conflict=true;};
        }
        var result = <div>
            {
                conflict && <Banner status="warning">
                    <p>
                        If product price is less than discount value, then product price will be zero.
                    </p>
                </Banner>
            }
            <List>
                <List.Item><TextStyle variation="strong">Discount: </TextStyle> {discount.toFixed(2)}</List.Item>
                <List.Item><TextStyle variation="strong">Price after discount: </TextStyle> {(price - discount).toFixed(2)}</List.Item>
            </List>
        </div>
        return result;
    }

    render() {
        const {
            customerType, customerExceptLogin, customerExceptTags, customerExceptedTags, tempExeptTagValue, tempCustomerTagValue, returingCondition, totalSpendValue, discountType, discountValue, appliesTo, title, state
        } = this.state;

        var customerSubSection = <div className="customers--subSection">
            <Stack vertical spacing="extraTight">
                {
                    ("all" === customerType) && <Checkbox
                        label="Except logged in"
                        checked={customerExceptLogin}
                        onChange={(v) => {
                            if(v){
                                this.setState({customerExceptTags:false})
                            }
                            this.setState({customerExceptLogin:v})
                        }}
                    />
                }
                <Checkbox
                    disabled={customerExceptLogin}
                    label="Except customer tags"
                    checked={customerExceptTags}
                    onChange={(v) => this.setState({customerExceptTags:v}) }
                />
                {
                    customerExceptTags && <div>
                        <FormLayout>
                            <FormLayout.Group>
                                <Popover
                                    preventAutofocus={true}
                                    preferredPosition="above"
                                    fullWidth
                                    active={tempExeptTagValue.length > 0}
                                    activator={
                                        <TextField
                                            autoFocus
                                            placeholder="Gold-Customer"
                                            label="Excepted tag"
                                            value={tempExeptTagValue}
                                            onChange={ (v) => this.setState({tempExeptTagValue:v}) }
                                        />
                                    }
                                    onClose={() => {this.setState({tempExeptTagValue:""})}}
                                >
                                    <ActionList items={[
                                        {
                                            icon: CirclePlusMinor,
                                            content: <span><TextStyle variation="strong">Add</TextStyle> {tempExeptTagValue}</span>, onAction: () => {
                                                this.handleExceptedTags(this.state.tempExeptTagValue)
                                            }
                                        }
                                    ]} />
                                </Popover>
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
                        <Popover
                            preventAutofocus={true}
                            preferredPosition="above"
                            fullWidth
                            active={tempCustomerTagValue.length > 0}
                            activator={
                                <TextField
                                    autoFocus
                                    placeholder="Gold-Customer"
                                    label="Customer tags"
                                    value={tempCustomerTagValue}
                                    onChange={ (v) => this.setState({tempCustomerTagValue:v}) }
                                />
                            }
                            onClose={() => {this.setState({tempCustomerTagValue:""})}}
                        >
                            <ActionList items={[
                                {
                                    icon: CirclePlusMinor,
                                    content: <span><TextStyle variation="strong">Add</TextStyle> {tempCustomerTagValue}</span>, onAction: () => {
                                        this.handleCustomerTags(this.state.tempCustomerTagValue)
                                    }
                                }
                            ]} />
                        </Popover>
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

        var customerSection = <Card title="Customer groups">
            <Card.Section>
                <FormLayout>
                    <Stack vertical spacing="tight">
                        <RadioButton
                            label="All customers"
                            checked={"all" === customerType}
                            onChange={(v) => this.setState({customerType:"all"}) }
                            helpText="All website visitors will see the discount price whether they are login or not."
                        />
                        {
                            ("all" === customerType) && customerSubSection
                        }
                        <RadioButton
                            label="Logged in customers"
                            checked={"login" === customerType}
                            onChange={(v) => this.setState({customerType:"login"}) }
                            helpText="Discount price will appear to only those customers who are login to their account"
                        />
                        {
                            ("login" === customerType) && customerSubSection
                        }
                        <RadioButton
                            label="Specific tag based customers"
                            checked={"tag" === customerType}
                            onChange={(v) => this.setState({customerType:"tag"}) }
                            helpText="Discount price will appear to only those customers who are login and have matching customer tag"
                        />
                        {
                            ("tag" === customerType) && getTagSection
                        }
                        <RadioButton
                            label="Returning customers"
                            checked={"returning" === customerType}
                            onChange={(v) => this.setState({customerType:"returning"}) }
                            helpText="Discount price will appear to only those customers who are login and their total spend amount must meet the criteria defined bellow"
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
                                                        { label:"Customer's total spend greater than", value: "gt" },
                                                        { label:"Customer's total spend less than", value: "lt" },
                                                        { label:"Customer's total spend equal to", value: "eq" }
                                                    ]}
                                                    value={returingCondition}
                                                    onChange={(v)=> {this.setState({returingCondition:v})}}
                                                ></Select>
                                            }
                                            autoFocus
                                            label="Returning customer condition"
                                            placeholder="0.00"
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
                                    </FormLayout.Group>
                                </FormLayout>
                            </div>
                        }
                    </Stack>
                </FormLayout>
            </Card.Section>
        </Card>

        var discountSection = <Card title="Discount type">
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
                            label="Price discount or Price off"
                            helpText={"price_off" === discountType ?"Discount value will deduct from the product price":null}
                            value={discountType}
                            checked={"price_off" === discountType}
                            id="price_off"
                            onChange={(v,id) => this.setState({discountType:id})}
                        />
                        <RadioButton
                            label="Set fix price"
                            helpText={"set_fix_price" === discountType?"This will set the product price equal to discount value":null}
                            value={discountType}
                            checked={"set_fix_price" === discountType}
                            id="set_fix_price"
                            onChange={(v,id) => this.setState({discountType:id})}
                        />
                    </Stack>
                </FormLayout>
            </Card.Section>
            <Card.Section>
                <FormLayout>
                    <FormLayout.Group>
                        <TextField
                            type="number"
                            label="Discount value"
                            placeholder="0.00"
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
        </Card>

        var appliesToSection = <Card title="Applies to">
            <Card.Section>
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

        var titleSection = <Card title="Title">
            <Card.Section>
                <FormLayout>
                    <FormLayout.Group>
                        <TextField
                            label="Tilte"
                            placeholder="Discount group title"
                            helpText="Only show to admin"
                            labelHidden
                            value={title}
                            onChange={(v) => {this.setState({title:v})}}
                        />
                    </FormLayout.Group>
                </FormLayout>
            </Card.Section>
        </Card>

        return (
            <Page
                title="Discounts"
            >
                <Layout>
                    <Layout.Section>
                        {titleSection}
                        {customerSection}
                        {discountSection}
                        {appliesToSection}
                    </Layout.Section>
                    <Layout.Section secondary>
                        <Card subdued title="Summary">
                            <Card.Section>
                                <Stack vertical spacing="loose">
                                    <Stack distribution="fill">
                                        <Stack.Item fill>
                                            <TextStyle variation="strong">{title?title:"No title"}</TextStyle>
                                        </Stack.Item>
                                        <Stack.Item fill>
                                            <Badge status="success">{state}</Badge>
                                        </Stack.Item>
                                    </Stack>
                                    <Stack vertical>
                                        <List type="bullet">
                                            <List.Item>
                                                {discountValue} off {appliesTo}
                                            </List.Item>
                                            <List.Item>
                                                For {customerType} customers
                                            </List.Item>
                                        </List>
                                    </Stack>
                                </Stack>
                            </Card.Section>
                        </Card>
                        <Card subdued title={<span>Example calculation <Badge status="info">For Testing</Badge></span>}>
                            <Card.Section>
                                <p>
                                    <TextStyle variation="subdued">This is only for testing purpose. This example information will not saved.</TextStyle>
                                </p>
                                <Stack vertical>
                                    <FormLayout>
                                        <Stack vertical spacing="extraTight">
                                            <TextField
                                                type="number"
                                                label="Item price"
                                                value={this.state.exampleProductPrice}
                                                onChange={(v) => {this.setState({exampleProductPrice:v})}}
                                            />
                                            <TextField
                                                type="number"
                                                label="Item quantity"
                                                value={this.state.exampleProductQty}
                                                onChange={(v) => {this.setState({exampleProductQty:v})}}
                                            />
                                            <TextField
                                                type="number"
                                                label="Discount value"
                                                placeholder="0.00"
                                                value={this.state.exampleDiscountValue}
                                                onChange={(v) => { this.setState({exampleDiscountValue:v})}}
                                                onBlur={()=> {
                                                    var exampleDiscountValue = this.state.exampleDiscountValue;
                                                    if(exampleDiscountValue && exampleDiscountValue.trim() !== ""){
                                                        try{
                                                            exampleDiscountValue = (Number(exampleDiscountValue).toFixed(2)).toString();
                                                        }catch(e){}
                                                        if(isNaN(exampleDiscountValue))return;
                                                        this.setState({exampleDiscountValue})
                                                    }
                                                }}
                                            />
                                            <Select
                                                label="Discount type"
                                                value={this.state.exampleDiscountType}
                                                options={[
                                                    {value: "percentage", label:"Percentage"},
                                                    {value: "price_off", label:"Price discount or Price off"},
                                                    {value: "set_fix_price", label:"Set fix price"}
                                                ]}
                                                onChange={(v)=> this.setState({exampleDiscountType:v}) }
                                            />
                                        </Stack>
                                    </FormLayout>
                                </Stack>
                            </Card.Section>
                            <Card.Section title="Result">
                                <div>{this.exampleResults()}</div>
                            </Card.Section>
                        </Card>
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
