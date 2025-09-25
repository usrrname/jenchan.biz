import wdyr from '@welldone-software/why-did-you-render';
import React from 'react';
if (process.env.NODE_ENV === 'development') {
    wdyr(React, {
        trackAllPureComponents: true,
    });
}