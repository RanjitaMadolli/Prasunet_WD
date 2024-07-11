package com.example.foodcalorieapp;

import android.content.Context;
import org.tensorflow.lite.Interpreter;
import org.tensorflow.lite.support.image.TensorImage;
import org.tensorflow.lite.support.tensorbuffer.TensorBuffer;
import org.tensorflow.lite.support.common.TensorProcessor;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;

public class FoodCalorieClassifier {

    private Interpreter interpreter;
    private int inputSize;
    
    public FoodCalorieClassifier(Context context, String modelPath, int inputSize) throws IOException {
        this.inputSize = inputSize;
        interpreter = new Interpreter(loadModelFile(context, modelPath));
    }

    private ByteBuffer loadModelFile(Context context, String modelPath) throws IOException {
        FileInputStream fileInputStream = new FileInputStream(context.getAssets().openFd(modelPath).getFileDescriptor());
        FileChannel fileChannel = fileInputStream.getChannel();
        long startOffset = context.getAssets().openFd(modelPath).getStartOffset();
        long declaredLength = context.getAssets().openFd(modelPath).getDeclaredLength();
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength).order(ByteOrder.nativeOrder());
    }

    public float[] classifyImage(ByteBuffer imageBuffer) {
        TensorImage inputImageBuffer = new TensorImage();
        inputImageBuffer.load(imageBuffer);
        
        TensorBuffer outputBuffer = TensorBuffer.createFixedSize(new int[]{1, NUM_CLASSES}, DataType.FLOAT32);
        interpreter.run(inputImageBuffer.getBuffer(), outputBuffer.getBuffer().rewind());

        // Post-processing to get the actual class and calorie prediction
        TensorProcessor probabilityProcessor = new TensorProcessor.Builder().build();
        float[] probabilities = probabilityProcessor.process(outputBuffer).getFloatArray();
        
        return probabilities;
    }
}
