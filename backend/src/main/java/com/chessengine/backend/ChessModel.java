package com.chessengine.backend;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.tensorflow.Result;
import org.tensorflow.SavedModelBundle;
import org.tensorflow.Signature;
import org.tensorflow.Tensor;
import org.tensorflow.types.TFloat32;

@Component
public class ChessModel implements AutoCloseable {
    private final SavedModelBundle model;

    public ChessModel(ResourceLoader resourceLoader) throws IOException {
        try {
            Resource modelResource = resourceLoader.getResource("classpath:models/saved_model.pb");
            String modelPath = modelResource.getFile().getParentFile().getAbsolutePath();
            this.model = SavedModelBundle.load(modelPath, "serve");
            for(Signature sig : this.model.signatures())
            {
                System.out.println("Signature name: " + sig.toString());
            }

            // Access the graph
        } catch (Exception e) {
            throw new RuntimeException("Failed to load the model in ChessModel " + e.toString());
        }
    }

    public List<String> predict(ChessBoard chessBoard) {
        // Create a tensor
        TFloat32 inputTensor = chessBoard.encodeBoardToTensor();
        System.out.println("Tensor created, inputting to NN");
        // Feed the tensor to the model
        Result res = this.model.call(Collections.singletonMap("input_layer", inputTensor));
        Tensor output = res.get(0);

        // Make predictions using the model
        float[] predictions = new float[4672];
        output.asRawTensor().data().asFloats().read(predictions);

        System.out.println("Java first few predictions:" + Arrays.toString(Arrays.copyOfRange(predictions, 0, 10)));
        int[] top5Predictions = getTopKIndices(predictions, 10);

        List<String> possibleMoves = new ArrayList<>();
        List<String> currentLegalMoves = chessBoard.getLegalMoves();

        for (int pred : top5Predictions) {
            int[] move = chessBoard.decodeMove(pred);
            String moveFen = chessBoard.getMoveFen(move[0], move[1]);

            if(currentLegalMoves.contains(moveFen))
            {
                possibleMoves.add(moveFen);
            }
        }

        System.out.println("Predicted legal moves (in order): " + possibleMoves);

        return possibleMoves;
    }

    @Override
    public void close() throws Exception {
        if (model != null) {
            model.close();
        }
    }

    // Helper functions and classes
    private static int[] getTopKIndices(float[] arr, int k) {
        IdxValPair[] pairs = new IdxValPair[arr.length];
        for (int i = 0; i < arr.length; i++) {
            pairs[i] = new IdxValPair(i, arr[i]);
        }

        Arrays.sort(pairs, (a, b) -> Float.compare(b.value, a.value));

        int[] result = new int[Math.min(k, arr.length)];
        for (int i = 0; i < result.length; i++) {
            result[i] = pairs[i].index;
        }

        return result;
    }

    private static class IdxValPair {
        int index;
        float value;

        IdxValPair(int index, float value) {
            this.index = index;
            this.value = value;
        }
    }

}
