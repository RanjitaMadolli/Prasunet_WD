package com.example.foodcalorieapp.utils;

import android.graphics.Bitmap;

public class ImageUtils {

    public static ByteBuffer convertBitmapToByteBuffer(Bitmap bitmap, int size) {
        ByteBuffer byteBuffer = ByteBuffer.allocateDirect(4 * size * size * 3);
        byteBuffer.order(ByteOrder.nativeOrder());
        int[] intValues = new int[size * size];
        bitmap.getPixels(intValues, 0, bitmap.getWidth(), 0, 0, bitmap.getWidth(), bitmap.getHeight());

        for (int pixelValue : intValues) {
            byteBuffer.putFloat(((pixelValue >> 16) & 0xFF) / 255.0f);
            byteBuffer.putFloat(((pixelValue >> 8) & 0xFF) / 255.0f);
            byteBuffer.putFloat((pixelValue & 0xFF) / 255.0f);
        }
        return byteBuffer;
    }
}
