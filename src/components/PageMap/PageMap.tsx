

import { Card, Text, Title } from '@tremor/react';

const PageMap = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: '300px' }}>
        <Title>Example Card</Title>
        <Text>This is an example card content using Tremor components.</Text>
      </Card>
    </div>
  );
};

export default PageMap;