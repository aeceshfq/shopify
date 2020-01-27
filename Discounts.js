import React, { Component } from 'react';
import { Page, Layout, Card, Heading, TextContainer, Link, TextField, RadioButton, FormLayout, Stack, Checkbox, Tag } from '@shopify/polaris';

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
        };
    }

    handleExceptedTags(v){
        if(v && v.trim() !== ""){
            if(v.indexOf(",") > -1){
                var customerExceptedTags = this.state.customerExceptedTags;
                try{
                    v = v.replace(",", "");
                }catch(e){}
                customerExceptedTags.push(v.trim());
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


    render() {
        const {
            customerType, customerExceptLogin, customerExceptTags, customerExceptedTags, tempExeptTagValue
        } = this.state;

        var customerSubSection = <div className="customerExcepted--Section">
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
                        />
                    </div>
                }
                {
                    (customerExceptedTags.length > 0) && <div>
                        <Stack>
                            {this.renderExceptedTags()}
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
