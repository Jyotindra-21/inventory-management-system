import * as React from 'react';

interface EmailTemplateProps {
    stockName: string;
    stock: number;

}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    stockName, stock
}) => (
    <div>
        <h1>Stock is running Low, {stockName}!</h1>
        <h1>Current Quantity is: {stock}!</h1>
    </div>
);
