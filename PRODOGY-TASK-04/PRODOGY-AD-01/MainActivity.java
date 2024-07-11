import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.camera.core.ImageCapture;
import androidx.camera.core.ImageCaptureException;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.content.ContextCompat;
import com.google.common.util.concurrent.ListenableFuture;
import java.nio.ByteBuffer;
import java.util.concurrent.ExecutionException;

public class MainActivity extends AppCompatActivity {

    private ImageCapture imageCapture;
    private FoodCalorieClassifier classifier;
    private PreviewView previewView;
    private ImageView capturedImageView;
    private TextView resultTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        previewView = findViewById(R.id.previewView);
        capturedImageView = findViewById(R.id.capturedImageView);
        resultTextView = findViewById(R.id.resultTextView);

        try {
            classifier = new FoodCalorieClassifier(this, "food_calorie_model.tflite", 224);
        } catch (IOException e) {
            e.printStackTrace();
        }

        startCamera();
    }

    private void startCamera() {
        ListenableFuture<ProcessCameraProvider> cameraProviderFuture = ProcessCameraProvider.getInstance(this);
        cameraProviderFuture.addListener(() -> {
            try {
                ProcessCameraProvider cameraProvider = cameraProviderFuture.get();
                bindPreview(cameraProvider);
            } catch (ExecutionException | InterruptedException e) {
                e.printStackTrace();
            }
        }, ContextCompat.getMainExecutor(this));
    }

    private void bindPreview(ProcessCameraProvider cameraProvider) {
        Preview preview = new Preview.Builder().build();
        imageCapture = new ImageCapture.Builder().build();

        preview.setSurfaceProvider(previewView.getSurfaceProvider());

        CameraSelector cameraSelector = new CameraSelector.Builder()
                .requireLensFacing(CameraSelector.LENS_FACING_BACK)
                .build();

        cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageCapture);
    }

    private void captureImage() {
        imageCapture.takePicture(ContextCompat.getMainExecutor(this), new ImageCapture.OnImageCapturedCallback() {
            @Override
            public void onCaptureSuccess(@NonNull ImageProxy image) {
                ByteBuffer buffer = image.getPlanes()[0].getBuffer();
                buffer.rewind();
                ByteBuffer imgData = ByteBuffer.allocateDirect(buffer.capacity());
                imgData.put(buffer);

                float[] results = classifier.classifyImage(imgData);
                displayResults(results);

                image.close();
            }

            @Override
            public void onError(@NonNull ImageCaptureException exception) {
                Log.e("ImageCapture", "Error capturing image", exception);
            }
        });
    }

    private void displayResults(float[] results) {
        // Display the results (food item and calorie estimation)
        resultTextView.setText("Food Item: " + results[0] + ", Calories: " + results[1]);
    }
}
